// Hämta kategori från URL, defaulta till "all"
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category") || "all";

// Mappa dina query-parametrar till API-kategorier
const categoryMap = {
  women: "women's clothing",
  men: "men's clothing",
  jewelery: "jewelery",
  electronics: "electronics"
};

// Anropa getData med den valda kategorin
getData("https://fakestoreapi.com/products", selectedCategory);

// Här definieras getData och loadProducts-funktionerna
async function getData(url, category) {
  try {
    const response = await fetch(url);
    let products = await response.json();

    // Filtrera om kategori inte är "all"
    if (category !== "all" && categoryMap[category]) {
      products = products.filter(product => product.category === categoryMap[category]);
    }

    loadProducts(products);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function loadProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Rensa tidigare innehåll

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row", "g-4");

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-lg-3", "col-md-6", "col-sm-12");

    productDiv.innerHTML = `
      <div class="card h-100">
          <img src="${product.image}" class="card-img-top img-fluid p-3" alt="${product.title}">
          <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description.substring(0, 100)}...</p>
              <p class="fw-bold">$${product.price}</p>
              <button class="btn btn-outline-secondary mt-auto w-100">Buy</button>
          </div>
      </div>
    `;
    rowDiv.appendChild(productDiv);
  });

  productContainer.appendChild(rowDiv);
}
