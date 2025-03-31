document.addEventListener("DOMContentLoaded", function () {
  // Kör loadCart bara när DOM är redo och när vi är på order-form.html
  if (window.location.pathname.includes("order-form.html")) {
    loadCart(); // Ladda varukorgen när sidan är redo
  }
  updateCartCounter(); // Uppdatera varukorgsräknaren på alla sidor
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("order-confirmation.html")) {
    clearCart(); // Återanvänd funktionen för att rensa varukorgen
  }
});

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

// Anropa getData med den valda kategorin
getData("https://fakestoreapi.com/products", selectedCategory);

// Funktion för att hämta data och filtrera efter kategori
async function getData(url, category) {
  try {
    const response = await fetch(url);
    let products = await response.json();

    // Filtrera om kategori inte är "all"
    if (category !== "all" && categoryMap[category]) {
      products = products.filter(
        (product) => product.category === categoryMap[category]
      );
    }

    loadProducts(products);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Funktion för att visa produkter
function loadProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Rensa tidigare innehåll

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row", "g-4");

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-lg-3", "col-md-6", "col-sm-12");

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
            onclick="addToCart(${product.id}, '${product.title.replace(
      /'/g,
      "\\'"
    )}', ${product.price}, '${product.image}')"
          >
            Buy
          </button>
        </div>
      </div>
    `;

    rowDiv.appendChild(productDiv);
  });

  productContainer.appendChild(rowDiv);
}

// Funktion för att uppdatera varukorgsräknaren
function updateCartCounter() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let counter = document.getElementById("cart-counter");

  // Uppdatera räknaren baserat på varukorgens längd
  if (counter)
    counter.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  localStorage.setItem(
    "cartCount",
    cart.reduce((acc, item) => acc + item.quantity, 0)
  ); // Spara i localStorage
}

// Funktion för att lägga till en produkt i varukorgen
function addToCart(id, title, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kolla om produkten redan finns i varukorgen
  const existingProductIndex = cart.findIndex((item) => item.id === id);

  if (existingProductIndex !== -1) {
    // Om produkten redan finns, öka kvantiteten
    cart[existingProductIndex].quantity++;
  } else {
    // Om produkten inte finns, lägg till den
    cart.push({ id, title, price, image, quantity: 1 });
  }

  // Spara uppdaterad varukorg i localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Uppdatera varukorgsräknaren
  updateCartCounter();
}

// Funktion för att ladda varukorgen i order-form.html
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartTable = document.getElementById("cart-items");
  let cartTotal = document.getElementById("cart-total");

  // Kontrollera att både cartTable och cartTotal finns i DOM
  if (!cartTable || !cartTotal) {
    console.error("Element saknas i DOM! Kanske körs loadCart() på fel sida.");
    return;
  }

  cartTable.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity; // Räkna med kvantiteten
    let row = `
      <tr>
        <td><img src="${item.image}" alt="${item.title}" width="50"></td>
        <td>${item.title}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="decreaseQuantity(${index})">-</button>
          ${item.quantity}
          <button class="btn btn-sm btn-success" onclick="increaseQuantity(${index})">+</button>
        </td>
      </tr>
    `;
    cartTable.innerHTML += row;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Funktion för att minska kvantiteten av en produkt
function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart[index].quantity > 1) {
    // Om kvantiteten är större än 1, minska kvantiteten
    cart[index].quantity--;
  } else {
    // Om kvantiteten är 1, ta bort produkten från varukorgen
    cart.splice(index, 1);
  }

  // Spara uppdaterad varukorg i localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Ladda om varukorgen och uppdatera räknaren
  loadCart();
  updateCartCounter();
}

// Funktion för att öka kvantiteten av en produkt
function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart(); // Ladda om varukorgen
  updateCartCounter(); // Uppdatera varukorgs räknare
}

// Funktion för att ta bort enskild produkt ur varukorgen
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartCounter();
}

// Funktion för att rensa hela varukorgen
function clearCart() {
  localStorage.removeItem("cart");
  localStorage.setItem("cartCount", "0");
  loadCart();
  updateCartCounter();
}

// Funktion för att hantera checkout
function checkout() {
  alert("Proceeding to checkout!");
  clearCart(); // Nollställ varukorgen efter betalning
}

// Koppla varukorgsikonen till order-form.html
document
  .querySelector(".fa-cart-shopping")
  .addEventListener("click", function () {
    window.location.href = "order-form.html";
  });

// Popup-funktion för produktdetaljer
function popUpWindow(imageSrc, title, description, price) {
  const modal = document.getElementById("customModal");
  document.getElementById("modalImage").src = imageSrc;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = description;
  document.getElementById("modalPrice").textContent = `$${price}`;

  modal.style.display = "block";
}

// Stäng modal när man klickar på 'X'
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("customModal").style.display = "none";
});

// Stäng modal när man klickar utanför innehållet
window.addEventListener("click", function (event) {
  const modal = document.getElementById("customModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
