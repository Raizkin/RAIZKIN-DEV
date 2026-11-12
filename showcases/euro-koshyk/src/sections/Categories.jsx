const categories = [
  { emoji: "🍫", name: "Солодощі" },
  { emoji: "☕", name: "Кава" },
  { emoji: "🥤", name: "Напої" },
  { emoji: "🧴", name: "Побутова хімія" },
  { emoji: "🏠", name: "Для дому" },
];

export default function Categories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-12">
          Категорії товарів
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer text-center"
            >
              <div className="text-5xl mb-4">{category.emoji}</div>

              <h3 className="font-bold text-gray-800">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}