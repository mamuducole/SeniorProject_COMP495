// Load navbar component
fetch('public/components/navbar.html')


  .then(response => {

    if (!response.ok) {
      throw new Error("Navbar file not found");
    }

    return response.text();
  })

  .then(data => {

    const navbarContainer =
      document.getElementById("navbar-container");

    if (!navbarContainer) {
      console.error("Navbar container missing");
      return;
    }

    navbarContainer.innerHTML = data;

    initializeSearch();
  })

  .catch(error => {
    console.error("Navbar failed to load:", error);
  });

function initializeSearch() {

  const searchToggle =
    document.getElementById("searchToggle");

  const searchBox =
    document.getElementById("searchBox");

  const searchInput =
    document.getElementById("siteSearchInput");

  const searchResults =
    document.getElementById("searchResults");

  if (
    !searchToggle ||
    !searchBox ||
    !searchInput ||
    !searchResults
  ) {
    return;
  }

  searchToggle.addEventListener("click", function(e) {

    e.preventDefault();

    if (searchBox.style.display === "block") {

      searchBox.style.display = "none";

    } else {

      searchBox.style.display = "block";

      searchInput.focus();
    }
  });
}