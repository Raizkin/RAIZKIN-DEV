export default function Footer() {
  return (
    <footer
  id="footer"
  className="bg-zinc-900 text-white mt-20"
>
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 gap-10">

          <div>
            <h2 className="text-3xl font-black mb-4">
              Euro Koshyk
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Європейські товари для всієї родини.
              Солодощі, кава, напої, косметика,
              побутова хімія та товари для дому.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">
              Контакти
            </h3>

            <div className="space-y-3 text-zinc-300">

  <p>
    📍 м. Боярка, вул. Шевченка, 82
  </p>

  <a
    href="tel:+380672242202"
    className="block hover:text-white transition"
  >
    📞 +38 (067) 224-22-02
  </a>

  <a
    href="https://www.tiktok.com/@eurokoshyk"
    target="_blank"
    rel="noopener noreferrer"
    className="block hover:text-white transition"
  >
    🎵 TikTok: @eurokoshyk
  </a>

</div>
          </div>

        </div>

        <div className="border-t border-zinc-800 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-zinc-500">

          <p>
            © {new Date().getFullYear()} Euro Koshyk
          </p>

          <p>
            Оригінальні товари з Європи 🇪🇺
          </p>

        </div>

      </div>
    </footer>
  );
}   