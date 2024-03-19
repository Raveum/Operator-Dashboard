document.addEventListener('DOMContentLoaded', function() {
    const navbarBurger = document.querySelector('.navbar-burger');
    const menu = document.getElementById(navbarBurger.dataset.target);

    navbarBurger.addEventListener('click', () => {
    navbarBurger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

});