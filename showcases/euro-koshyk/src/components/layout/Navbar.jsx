
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logos/logo.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Головна", to: "/" },
    { label: "Каталог", to: "/catalog" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">

        {/* Логотип */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={logo}
            alt="Euro Koshyk"
            className="h-12 w-12 rounded-full border object-cover"
          />

          <div>
            <h1 className="text-lg font-black text-red-600 md:text-xl">
              Euro Koshyk
            </h1>
            <p className="hidden text-xs text-zinc-500 sm:block">
              Товари з Європи
            </p>
          </div>
        </Link>

        {/* Навигация для ПК */}
        <nav className="hidden items-center gap-6 lg:flex">
          <a
            href="/#projects"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:text-red-600"
          >
            ← Повернутися до портфоліо
          </a>

          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-medium text-gray-700 transition hover:text-red-600"
            >
              {item.label}
            </Link>
          ))}

          <a
            href="/#footer"
            className="font-medium text-gray-700 transition hover:text-red-600"
          >
            Контакти
          </a>
        </nav>

        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@eurokoshyk"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-xl bg-red-600 px-5 py-2 font-bold text-white transition hover:bg-red-700 lg:inline-flex"
        >
          TikTok
        </a>

        {/* Бургер */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="text-3xl text-zinc-700 lg:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Мобильное меню */}
      {isOpen && (
        <nav
          id="mobile-navigation"
          className="flex flex-col gap-4 border-t bg-white px-5 py-5 lg:hidden"
        >
          <a
            href="/#projects"
            onClick={() => setIsOpen(false)}
            className="rounded-xl bg-gray-100 px-4 py-3 text-center text-gray-700 transition hover:text-red-600"
          >
            ← Повернутися до портфоліо
          </a>

          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="font-medium text-gray-700 transition hover:text-red-600"
            >
              {item.label}
            </Link>
          ))}

          <a
            href="/#footer"
            onClick={() => setIsOpen(false)}
            className="font-medium text-gray-700 transition hover:text-red-600"
          >
            Контакти
          </a>

          <a
            href="https://www.tiktok.com/@eurokoshyk"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="rounded-xl bg-red-600 px-4 py-3 text-center font-bold text-white transition hover:bg-red-700"
          >
            TikTok
          </a>
        </nav>
      )}
    </header>
  );
}
