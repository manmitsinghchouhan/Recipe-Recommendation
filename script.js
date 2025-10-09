// --- SELECTORS ---
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("backToTop");

// --- NEW: A list of known cuisines for our intelligent search ---
const knownCuisines = [
  "american",
  "british",
  "canadian",
  "chinese",
  "croatian",
  "dutch",
  "egyptian",
  "french",
  "greek",
  "indian",
  "irish",
  "italian",
  "jamaican",
  "japanese",
  "kenyan",
  "malaysian",
  "mexican",
  "moroccan",
  "polish",
  "portuguese",
  "russian",
  "spanish",
  "thai",
  "tunisian",
  "turkish",
  "vietnamese",
];

// --- EVENT LISTENERS ---
searchForm.addEventListener("submit", handleSearch);
// NEW: Add a listener to the input box for key presses
searchInput.addEventListener("keydown", handleEnterKey);

mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});
themeToggle.addEventListener("click", toggleTheme);
backToTop.addEventListener("click", scrollToTop);
window.addEventListener("scroll", handleScroll);

// --- Clear Search Button ---
const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", () => {
  searchInput.value = ""; // Clear input
  mealList.innerHTML = ""; // Clear results
  mealList.classList.remove("notFound"); // Reset state
});

// --- FUNCTIONS ---

// This function runs when you click a BUTTON
function handleSearch(event) {
  event.preventDefault(); // Stop page reload
  const searchType =
    event.submitter.id === "search-btn-ingredients" ? "i" : "a";
  getMealList(searchType);
}

// NEW: This function runs when you press a KEY in the input box
function handleEnterKey(event) {
  // Only run if the key pressed is "Enter"
  if (event.key === "Enter") {
    event.preventDefault(); // Stop the form from submitting twice

    const searchTerm = searchInput.value.trim().toLowerCase();

    // Check if the search term is in our list of cuisines
    if (knownCuisines.includes(searchTerm)) {
      getMealList("a"); // If it is, perform an AREA search
    } else {
      getMealList("i"); // Otherwise, perform an INGREDIENT search
    }
  }
}

// Rewritten with modern async/await and try/catch for error handling.
async function getMealList(searchType) {
  const searchInputTxt = searchInput.value.trim();
  if (!searchInputTxt) return;

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?${searchType}=${searchInputTxt}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    let html = "";

    if (data.meals) {
      data.meals.forEach((meal) => {
        html += `
          <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="meal-name">
              <h3>${meal.strMeal}</h3>
              <a href="#" class="recipe-btn">Get Recipe</a>
            </div>
          </div>
        `;
      });
      mealList.classList.remove("notFound");
    } else {
      html = "Sorry, we didn't find any meal!";
      mealList.classList.add("notFound");
    }
    mealList.innerHTML = html;
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    mealList.innerHTML = "An error occurred. Please try again later.";
    mealList.classList.add("notFound");
  }
}

// Async function to get a meal recipe
async function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    const mealItem = e.target.closest(".meal-item");
    const mealId = mealItem.dataset.id;
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.meals) {
        mealRecipeModal(data.meals[0]);
      }
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  }
}

// Display meal recipe modal
function mealRecipeModal(meal) {
  if (!meal) return;

  const html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
    <div class="recipe-link">
      <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
    
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

// ----- Dark / Light Mode Toggle -----
function toggleTheme() {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
}

// ---------- Back to Top Button ----------
function handleScroll() {
  if (window.scrollY > 300) {
    backToTop.style.display = "flex";
  } else {
    backToTop.style.display = "none";
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
