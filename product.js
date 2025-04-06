// Hämta kategori från URL, defaulta till "all"
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category") || "all";

// Mappa dina query-parametrar till API-kategorier
const categoryMap = {
  women: "women's clothing",
  men: "men's clothing",
  jewelery: "jewelery",
  electronics: "electronics",
};

// Anropar funktionen getData med två argument.
// URL till API:t där produkterna finns och en vald kategori t ex "mens clothing".
getData("https://fakestoreapi.com/products", selectedCategory);

// Asynkron funktion med fetch för att hämta data från nätet
async function getData(url, category) {
  try {
    const response = await fetch(url); // Hämta produkterna från API:t. Await pausar funktionen tills fetch är klar.
    let products = await response.json(); // Gör om svaret till JSON (en array med produktobjekt)

    // Filtrera om kategori inte är "all"
    if (category !== "all" && categoryMap[category]) {
      products = products.filter(
        (product) => product.category === categoryMap[category]
      );
    }
    // Skickar den filtrerade listan vidare till loadProducts för att visa dem på sidan.
    loadProducts(products);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Skapar produktkort
function loadProducts(products) {
  const productContainer = document.getElementById("product-container"); // Hämtar HTML-elementet där produkterna ska visas
  productContainer.innerHTML = ""; // Rensa tidigare innehåll

  // Skapar ett div-element med klasser för Bootstrap-rader och gap-4 mellan kolumner.
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row", "g-4");

  // Loopar igenom varje produkt och skapar div för varje produkt, som får kolumnstorlek för olika skärmstorlekar
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-lg-3", "col-md-6", "col-sm-12");

    // Lägger in HTML för varje produkt och skapar kort
    productDiv.innerHTML = `
      <div class="card h-100">
        <div class="ratio ratio-4x3">
          <img 
            src="${product.image}" 
            class="card-img-top img-fluid" 
            style="object-fit: contain;" 
            alt="${product.title}"
            onclick="popUpWindow(
              '${product.image.replace(/'/g, "\\'")}', 
              '${product.title.replace(/'/g, "\\'")}', 
              '${product.description.replace(/'/g, "\\'")}', 
              '${product.price}'
            )"
          >
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-truncate">${product.title}</h5>
          <p class="card-text flex-grow-1">${product.description.substring(
            0,
            100
          )}...</p>
          <p class="fw-bold">${product.price}$</p>
          <button 
            class="btn btn-outline-secondary mt-auto w-100" 
            onclick="location.href='order-form.html?product-id=${product.id}'"
          >
            Buy
          </button>
        </div>
      </div>
    `;

    // Lägg till produkt i raden
    rowDiv.appendChild(productDiv);
  });

  // Lägg till rad i HTML
  productContainer.appendChild(rowDiv);
}

function popUpWindow(imageSrc, title, description, price) {
  const modal = document.getElementById("customModal");
  document.getElementById("modalImage").src = imageSrc;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = description;
  document.getElementById("modalPrice").textContent = `$${price}`;

  modal.style.display = "block";
}

// Close modal when clicking on 'X' button
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("customModal").style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  const modal = document.getElementById("customModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
