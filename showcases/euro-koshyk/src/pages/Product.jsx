const products = [
  {
    name: "Milka Oreo",
    brand: "Milka",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60",
  },
  {
    name: "Jacobs Monarch",
    brand: "Jacobs",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  },
  {
    name: "Nutella",
    brand: "Ferrero",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
  },
];

export default function Product() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black mb-10">Популярні товари</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">{product.name}</h3>

                <p className="text-gray-500 font-medium">{product.brand}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
