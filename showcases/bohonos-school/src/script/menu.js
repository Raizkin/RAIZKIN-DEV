// подключи этот файл внизу перед </body>, чтобы элементы уже были в DOM

const menu = document.querySelector('[data-modal-header]');
const openBtn = document.querySelector('[data-modal-header-open]');
const closeBtn = document.querySelector('[data-modal-header-close]');

if (menu && openBtn && closeBtn) {
  const links = menu.querySelectorAll('.backdrop__link');

  function openMenu() {
    menu.classList.remove('is-hidden');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    menu.classList.add('is-hidden');
    document.body.classList.remove('no-scroll');
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  links.forEach(link => link.addEventListener('click', closeMenu));
}
