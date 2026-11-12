const products = [
  {
    name: "Milka Choco Wafer",
    image: "🍫"
  },
  {
    name: "Nutella Biscuits",
    image: "🥜"
  },
  {
    name: "Jacobs Gold",
    image: "☕"
  },
  {
    name: "Haribo Goldbears",
    image: "🍬"
  }
];

export default function NewProducts() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-black text-center mb-12">
          Новинки асортименту
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-3xl shadow-md p-8 text-center hover:shadow-xl transition"
            >
              <div className="text-6xl mb-4">
                {product.image}
              </div>

              <h3 className="font-bold text-lg">
                {product.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}