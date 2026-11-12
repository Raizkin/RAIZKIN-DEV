
import { useState } from "react"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import ScrollToTop from "../components/ScrollToTop"

const DEPARTMENTS = [
  { id: "all", name: "Усі товари", icon: "🛒" },
  { id: "food", name: "Продукти харчування", icon: "🥛" },
  { id: "beauty", name: "Косметика та догляд", icon: "🧴" },
  { id: "home", name: "Для дому", icon: "🏠" },
]

const CATEGORIES = {
  all: [],
  food: [
    { id: "", name: "Усі продукти" },
    { id: "dairy", name: "Молочні продукти" },
    { id: "bread", name: "Хліб" },
    { id: "cheese", name: "Сири" },
    { id: "meat", name: "М'ясні продукти" },
    { id: "vegetables", name: "Овочі" },
    { id: "fruits", name: "Фрукти" },
    { id: "pasta", name: "Макарони" },
    { id: "cereals", name: "Крупи" },
    { id: "drinks", name: "Напої" },
    { id: "coffee", name: "Кава" },
    { id: "tea", name: "Чай" },
    { id: "snacks", name: "Снеки" },
    { id: "cookies", name: "Печиво" },
    { id: "chocolate", name: "Шоколад" },
    { id: "candy", name: "Цукерки" },
  ],
  beauty: [
    { id: "", name: "Усі товари" },
    { id: "shampoo", name: "Шампуні" },
    { id: "soap", name: "Мило" },
    { id: "shower", name: "Гелі для душу" },
    { id: "toothpaste", name: "Зубні пасти" },
    { id: "cream", name: "Креми" },
  ],
  home: [
    { id: "", name: "Усі товари" },
    { id: "cleaning", name: "Засоби для прибирання" },
    { id: "laundry", name: "Засоби для прання" },
    { id: "dishes", name: "Миття посуду" },
  ],
}

const EMPTY_MESSAGE =
  "Не вдалося завантажити товари. Спробуйте пізніше."

export default function Catalog() {
  const [department, setDepartment] = useState("all")
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")

  const currentCategories = CATEGORIES[department] || []

  const departmentName =
    DEPARTMENTS.find(item => item.id === department)?.name ||
    "Усі товари"

  const categoryName =
    currentCategories.find(item => item.id === category)?.name ||
    departmentName

  function changeDepartment(id) {
    setDepartment(id)
    setCategory("")
    setSearch("")
  }

  function changeCategory(id) {
    setCategory(id)
    setSearch("")
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-screen-2xl px-5 py-14 md:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-600">
            EURO KOSHYK
          </p>

          <h1 className="text-4xl font-black md:text-5xl">
            Каталог товарів
          </h1>

          <p className="mt-4 text-gray-500">
            Продукти харчування, напої, солодощі,
            косметика та товари для дому.
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Пошук товарів..."
          className="mb-9 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 outline-none focus:border-red-500"
        />

        <div className="mb-8 flex flex-wrap gap-3">
          {DEPARTMENTS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeDepartment(item.id)}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                department === item.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>

        {currentCategories.length > 0 && (
          <div className="mb-9 flex flex-wrap gap-2">
            {currentCategories.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => changeCategory(item.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  category === item.id
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        <h2 className="mb-7 text-2xl font-black text-gray-900">
          {categoryName}
        </h2>

        <div
          role="status"
          className="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-red-600"
        >
          {EMPTY_MESSAGE}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}
