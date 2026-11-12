import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">

        <div className="max-w-3xl">

          <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            🇪🇺 Оригінальні товари з Європи
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
            Європейські товари
            <br />
            для всієї родини
          </h1>

          <p className="mt-6 text-base md:text-xl text-red-100">
            Солодощі, кава, напої,
            побутова хімія та товари для дому.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            <Link
              to="/catalog"
              className="bg-black hover:bg-zinc-800 px-8 py-4 rounded-2xl font-bold text-center transition"
            >
              Переглянути асортимент
            </Link>

            <a
              href="https://www.tiktok.com/@eurokoshyk"
              target="_blank"
              rel="noreferrer"
              className="border border-white px-8 py-4 rounded-2xl font-bold text-center hover:bg-white hover:text-red-600 transition"
            >
              TikTok
            </a>

          </div>

        </div>

      </div>
    </section>
  );
} 