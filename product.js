async function getData(url) {
  try {
    const response = await fetch(url);
    const products = await response.json();
    console.log(products);
    loadProducts(products);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function loadProducts(products) {
  let productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Rensar gamla kort

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row", "g-4");

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-lg-3", "col-md-6", "col-sm-12");

    //lagt till ratio-4x3 + object-fit: contain + text-truncate
    productDiv.innerHTML = `
          <div class="card h-100">
              <div class="ratio ratio-4x3">
                  <img src="${product.image}" 
                       class="card-img-top img-fluid" 
                       style="object-fit: contain;" 
                       alt="${product.title}">
              </div>
              <div class="card-body d-flex flex-column">
                  <h5 class="card-title text-truncate">${product.title}</h5>
                  <p class="card-text flex-grow-1">${product.description.substring(
                    0,
                    100
                  )}...</p>
                  <p class="fw-bold">${product.price}€</p>
                  <button class="btn btn-outline-secondary mt-auto w-100">Buy</button>
              </div>
          </div>
      `;

    rowDiv.appendChild(productDiv);
  });

  productContainer.appendChild(rowDiv);
}

getData("https://fakestoreapi.com/products");
