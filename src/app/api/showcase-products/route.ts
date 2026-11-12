
import { NextRequest, NextResponse } from "next/server"

const categories: Record<string, string> = {
  chocolate: "chocolates",
  coffee: "coffees",
  drinks: "beverages",
  cookies: "biscuits",
  snacks: "snacks",
}

export async function GET(request: NextRequest) {
  const category =
    request.nextUrl.searchParams.get("category") || "chocolate"

  if (!categories[category]) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    )
  }

  const params = new URLSearchParams({
    categories_tags_en: categories[category],
    page: request.nextUrl.searchParams.get("page") || "1",
    page_size: "24",
    fields:
      "code,product_name,product_name_uk,brands,quantity,image_front_url,image_url",
  })

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/search?${params}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      throw new Error("API unavailable")
    }

    const data = await response.json()

    return NextResponse.json({
      products: (data.products || []).map(
        (p: {
          code: string
          product_name?: string
          product_name_uk?: string
          brands?: string
          quantity?: string
          image_front_url?: string
          image_url?: string
        }) => ({
          id: p.code,
          name: p.product_name_uk || p.product_name || "Product",
          brand: p.brands || "",
          quantity: p.quantity || "",
          image: p.image_front_url || p.image_url || "",
        })
      ),
      count: data.count || 0,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 502 }
    )
  }
}
