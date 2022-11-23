const serverurl = process.env.SERVER_API;

console.log("Dev m3", serverurl);

//carrinho implementação
const root = document.querySelector(":root")
const teste = root.style.getPropertyValue("--text");
console.log(teste)
root.addEventListener("click", () => {
  root.style.setProperty("--text", "'1'");
  console.log(root.style.getPropertyValue("--text"));
});


// filtro seleção
const iconCart = document.querySelector(".icon-cart")
const filterSelect = document.querySelector(".filter-select")
const filterOption = document.querySelector(".filter-options")

filterSelect.addEventListener("click", () => {
  filterOption.classList.toggle("active");
});

//moreColors

const moreColors = document.querySelector(".more-colors");
const moreColorsData = document.querySelector("[data-moreColors]");
moreColors.addEventListener("click", () => {
  // moreColors.dataset.dataMoreColors = "active";
  if (moreColorsData.dataset.morecolors === "active") {
    moreColorsData.dataset.morecolors = "";
  }
  else {
    moreColorsData.dataset.morecolors = "active"
  }
  console.log(moreColorsData.dataset.morecolors);
});

// gridSize

const itemSize = document.querySelectorAll(".item-size");
console.log(itemSize);
itemSize.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
    // console.log(item);
  })
})


// api teste
const productsGrid = document.querySelector(".products-grid");
const options = { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 3 }
const formatNumber = new Intl.NumberFormat('pt-BR', options)

async function fetchProducts() {
  const data = await fetch("http://localhost:5000/products");
  const response = await data.json();
//  getProducts(response);
renderProducts(response);
}

// function getProducts(products){
//   const productsArray = products.map((item)=>{
//     return item
//    })
//    console.log(productsArray)
// }




function renderProducts(products){
  
    products.forEach((item)=>{
      productsGrid.innerHTML +=
        `
          <li class="card-item">
            <img src=${item.image} alt="">
            <div class="card-description">
              <h2 class="card-title">${item.name}</h2>
              <p class="card-price">${formatNumber.format(item.price)}</p>
              <span class="card-parcel">até ${item.parcelamento[0]}x de ${formatNumber.format(item.parcelamento[1])}</span>
            </div>
            <button class="btn default">COMPRAR</button>
          </li>
        `

    })
}

fetchProducts();

