const burger = document.querySelector("#nav-icon3");
const sidebar = document.querySelector("#sidebar");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  sidebar.classList.toggle("expand-menu");
});
