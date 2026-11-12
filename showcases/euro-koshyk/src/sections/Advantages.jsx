const advantages = [
  {
    icon: "🇪🇺",
    title: "Європейська якість",
    text: "Оригінальні товари з країн Європи."
  },
  {
    icon: "🛒",
    title: "Широкий асортимент",
    text: "Солодощі, кава, напої, косметика та багато іншого."
  },
  {
    icon: "⭐",
    title: "Популярні бренди",
    text: "Товари, які цінують покупці по всій Європі."
  }
];

export default function Advantages() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-black text-center mb-12">
          Чому обирають нас
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-3xl shadow-md text-center"
            >
              <div className="text-6xl mb-4">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}