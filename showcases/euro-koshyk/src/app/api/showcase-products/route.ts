
import { NextRequest, NextResponse } from "next/server"

type Source = "food" | "beauty" | "home"
type Department = Source | "all"

type RawProduct = {
  code?: string
  product_name?: string
  product_name_uk?: string
  brands?: string
  quantity?: string
  image_front_url?: string
  image_url?: string
}

type Product = {
  id: string
  name: string
  brand: string
  quantity: string
  image: string
  source: Source
}

type SearchResult = {
  products: Product[]
  count: number
}

const SOURCES: Record<Source, string> = {
  food: "https://world.openfoodfacts.org",
  beauty: "https://world.openbeautyfacts.org",
  home: "https://world.openproductsfacts.org",
}

const FIELDS = [
  "code",
  "product_name",
  "product_name_uk",
  "brands",
  "quantity",
  "image_front_url",
  "image_url",
].join(",")

const FOOD_CATEGORIES = [
  "dairy-products",
  "breads",
  "cheeses",
  "pastas",
  "rice",
  "breakfast-cereals",
  "vegetables",
  "fruits",
  "meats",
  "frozen-foods",
  "beverages",
  "fruit-juices",
  "coffees",
  "teas",
  "snacks",
  "biscuits",
  "chocolates",
  "candies",
  "sauces",
  "canned-foods",
]

const BEAUTY_CATEGORIES = [
  "shampoos",
  "soaps",
  "shower-gels",
  "toothpastes",
  "face-creams",
]

const HOME_CATEGORIES = [
  "cleaning-products",
  "laundry-detergents",
  "dishwashing-products",
]

const CATEGORY_OPTIONS: Record<Source, string[]> = {
  food: FOOD_CATEGORIES,
  beauty: BEAUTY_CATEGORIES,
  home: HOME_CATEGORIES,
}

// Categories used to create a diverse first page.
const MIXED_CATEGORIES: {
  source: Source
  category: string
}[] = [
  { source: "food", category: "dairy-products" },
  { source: "food", category: "breads" },
  { source: "food", category: "cheeses" },
  { source: "food", category: "pastas" },
  { source: "food", category: "rice" },
  { source: "food", category: "beverages" },
  { source: "food", category: "snacks" },
  { source: "food", category: "chocolates" },
  { source: "beauty", category: "shampoos" },
  { source: "home", category: "cleaning-products" },
]

function normalizeProducts(
  items: RawProduct[],
  source: Source
): Product[] {
  return items
    .filter(
      item =>
        item.code &&
        (item.product_name_uk || item.product_name)
    )
    .map(item => {
      const rawImage =
        item.image_front_url || item.image_url || ""

      return {
        id: `${source}:${item.code}`,
        name:
          item.product_name_uk ||
          item.product_name ||
          "",
        brand: item.brands?.split(",")[0]?.trim() || "",
        quantity: item.quantity || "",
        image: rawImage.startsWith("https://")
          ? rawImage
          : "",
        source,
      }
    })
}

async function fetchProducts({
  source,
  category,
  search,
  page,
  pageSize,
}: {
  source: Source
  category?: string
  search?: string
  page: number
  pageSize: number
}): Promise<SearchResult> {
  const baseUrl = SOURCES[source]

  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    fields: FIELDS,
  })

  let url: string

  if (search) {
    // Legacy API supports searching by product name.
    params.set("search_terms", search)
    params.set("search_simple", "1")
    params.set("action", "process")
    params.set("json", "1")

    url = `${baseUrl}/cgi/search.pl?${params}`
  } else {
    if (category) {
      params.set("categories_tags_en", category)
    }

    url = `${baseUrl}/api/v2/search?${params}`
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "EuroKoshykPortfolio/1.0 (https://github.com/Raizkin/Euro-Koshyk)",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(
      `${source} API returned ${response.status}`
    )
  }

  const data = (await response.json()) as {
    products?: RawProduct[]
    count?: number
  }

  return {
    products: normalizeProducts(data.products || [], source),
    count: Number(data.count) || 0,
  }
}

function uniqueProducts(products: Product[]): Product[] {
  const map = new Map<string, Product>()

  for (const product of products) {
    if (!map.has(product.id)) {
      map.set(product.id, product)
    }
  }

  return Array.from(map.values())
}

function interleave(results: SearchResult[]): Product[] {
  const products: Product[] = []
  const longest = Math.max(
    0,
    ...results.map(result => result.products.length)
  )

  for (let index = 0; index < longest; index++) {
    for (const result of results) {
      const product = result.products[index]

      if (product) {
        products.push(product)
      }
    }
  }

  return uniqueProducts(products)
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const source = (params.get("source") || "all") as Department
  const category = params.get("category") || ""
  const search = (params.get("search") || "").trim().slice(0, 80)

  const rawPage = Number(params.get("page") || "1")

  const page = Number.isInteger(rawPage)
    ? Math.max(1, Math.min(30, rawPage))
    : 1

  if (!["all", "food", "beauty", "home"].includes(source)) {
    return NextResponse.json(
      { error: "Invalid department" },
      { status: 400 }
    )
  }

  if (
    source !== "all" &&
    category &&
    !CATEGORY_OPTIONS[source].includes(category)
  ) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    )
  }

  try {
    // Search across all available databases.
    if (search) {
      const sources: Source[] =
        source === "all"
          ? ["food", "beauty", "home"]
          : [source]

      const pageSize = source === "all" ? 12 : 24

      const settled = await Promise.allSettled(
        sources.map(item =>
          fetchProducts({
            source: item,
            search,
            page,
            pageSize,
          })
        )
      )

      const results = settled
        .filter(
          (
            item
          ): item is PromiseFulfilledResult<SearchResult> =>
            item.status === "fulfilled"
        )
        .map(item => item.value)

      if (!results.length) {
        throw new Error("All search sources unavailable")
      }

      return NextResponse.json({
        products: interleave(results),
        hasMore: results.some(
          item => item.count > page * pageSize
        ),
        page,
      })
    }

    // One specific category.
    if (category && source !== "all") {
      const result = await fetchProducts({
        source,
        category,
        page,
        pageSize: 24,
      })

      return NextResponse.json({
        products: uniqueProducts(result.products),
        hasMore: result.count > page * 24,
        page,
      })
    }

    // All products: retrieve several different categories,
    // not just the most common category in the database.
    const groups =
      source === "all"
        ? MIXED_CATEGORIES
        : CATEGORY_OPTIONS[source].map(item => ({
            source,
            category: item,
          }))

    // For the broad food department, use a selection
    // of different product types per page.
    const selectedGroups =
      source === "food"
        ? groups.filter(
            group =>
              [
                "dairy-products",
                "breads",
                "pastas",
                "cheeses",
                "rice",
                "beverages",
                "snacks",
                "chocolates",
              ].includes(group.category)
          )
        : groups

    const pageSize = 4

    const settled = await Promise.allSettled(
      selectedGroups.map(group =>
        fetchProducts({
          source: group.source,
          category: group.category,
          page,
          pageSize,
        })
      )
    )

    const results = settled
      .filter(
        (
          item
        ): item is PromiseFulfilledResult<SearchResult> =>
          item.status === "fulfilled"
      )
      .map(item => item.value)

    if (!results.length) {
      throw new Error("All product sources unavailable")
    }

    return NextResponse.json({
      products: interleave(results),
      hasMore: results.some(
        item => item.count > page * pageSize
      ),
      page,
    })
  } catch {
    return NextResponse.json(
      {
        error: "Не вдалося завантажити каталог",
        products: [],
      },
      { status: 502 }
    )
  }
}
