export function displayActiveLink() {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const dropdownItems = document.querySelectorAll(
    ".dropdown-menu .dropdown-item"
  );
  const currentPath = window.location.pathname.split("/").pop();
  const currentHash = window.location.hash;

  navLinks.forEach((link) => {
    if (
      link.getAttribute("href") === "index.html" &&
      (currentPath === "" || currentPath === "index.html")
    ) {
      link.classList.add("active");
    } else if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
  if (currentHash) {
    mostrarRegionActiva(currentHash, dropdownItems, navLinks);
  }
}

function mostrarRegionActiva(currentHash, dropdownItems, navLinks) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  dropdownItems.forEach((item) => {
    item.classList.remove("active");
  });

  dropdownItems.forEach((item) => {
    if (item.getAttribute("href") === currentHash && currentHash !== "") {
      // item.classList.add('active');
      // Activar también el botón padre "Categorías"
      const parentDropdownToggle = item
        .closest(".dropdown")
        .querySelector(".nav-link.dropdown-toggle");
      if (parentDropdownToggle) {
        parentDropdownToggle.classList.add("active");
      }
    }
  });
}
