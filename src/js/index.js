const serverurl = process.env.SERVER_API;
let dataProducts = [];
let filtroGlobal = [];
let order = highPriceds;
let limit = 6;
console.log("Dev m3", serverurl);

//carrinho implementação
const root = document.querySelector(":root")
const teste = root.style.getPropertyValue("--text");
// console.log(teste)
root.addEventListener("click", () => {
  root.style.setProperty("--text", "'1'");
  // console.log(root.style.getPropertyValue("--text"));
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
  // console.log(moreColorsData.dataset.morecolors);
});

// gridSize

const itemSize = document.querySelectorAll(".item-size");
// console.log(itemSize);
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
  dataProducts = response.map((item) => {
    return item
  })
  renderProducts(response);
  filtroGlobal = dataProducts;
}

// function getProducts(products){
//   const productsArray = products.map((item)=>{
//     return item
//    })
//    console.log(productsArray)
// }




function renderProducts(products) {

  products.forEach((item, index) => {
    if (index < limit) {
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
    }

  })
  limit = 6;



}

fetchProducts();


// ordenação
const highPriced = document.querySelector(".high-priced");
const smallPrice = document.querySelector(".small-price");
const recentSelect = document.querySelector(".recent");
// console.log(highPriced);

highPriced.addEventListener("click", highPriceds);
smallPrice.addEventListener("click", smallPrices);
recentSelect.addEventListener("click", recent);

function highPriceds() {
  filtroGlobal.sort(function (a, b) {
    return a.price < b.price ? 1 : a.price > b.price ? -1 : 0;
  });
  clearProducts();
  renderProducts(filtroGlobal);
  order = highPriceds;
  // console.log(filtroGlobal);
  // console.log(order)
}

function smallPrices() {
  filtroGlobal.sort(function (a, b) {
    return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
  });
  clearProducts();
  renderProducts(filtroGlobal);
  order = smallPrices;
  // console.log(filtroGlobal);
  // console.log(order)
}

function recent() {
  filtroGlobal.sort(function (a, b) {
    const date1 = new Date(a.date)
    const date2 = new Date(b.date)
    return date2 - date1
  });
  clearProducts();
  renderProducts(filtroGlobal);
  order = recent;
  // console.log(filtroGlobal);
  // console.log(order)
}

function clearProducts() {
  const cardsItems = document.querySelectorAll(".card-item");
  cardsItems.forEach((item) => {
    item.remove();
  })
  // productsGrid.innerHTML = "";
}


// filtro cor 

// preciso deixar esse evento generico e filtrar com 

//tentar utilizar dataset
const checkbox = document.querySelectorAll("input[type='checkbox']");
const colors = [];
const sizes = [];
const prices = [];

checkbox.forEach((item) => {
  item.addEventListener("change", (event) => {
    console.log(filtroGlobal, limit, "consoles")
    const idItem = event.currentTarget.getAttribute("id");
    console.log(idItem);
    console.log(item.parentElement.parentElement.dataset);
    if (item.checked) {
      checkbox.forEach((item) => {
        if (item.checked && !colors.includes(item.getAttribute("id"))) {
          colors.push(item.getAttribute("id"));
          // console.log(item, "checked")
          // console.log(colors);
          filtroGlobal = []
          filterColor(colors, filtroGlobal)
          // console.log(filtroGlobal, "globals")
        }

      })
    }
    else {
      // clearProducts();

      // const teste = colors.slice(colors.indexOf(item.id), 2);
      // colors.push("fudeu")
      // console.log("deu certo")
      // console.log(colors.indexOf(item.id));
      // console.log(item.id)
      if (!item.checked) {
        colors.splice(colors.indexOf(item.id), 1);
        if (colors.length > 0) {
          // console.log(colors, "cores")
          filtroGlobal = [];
          // console.log("filtrado..")
          filterColor(colors, filtroGlobal)
          // console.log("filtrou")
          // console.log(filtroGlobal, "teste Global");
        }
        else {
          // filtroGlobal = [];
          clearProducts();
          filtroGlobal = dataProducts;
          renderProducts(dataProducts);
          // filtroGlobal = [];
          // console.log(filtroGlobal)
        }

      }

      // }
      // console.log(colors, "ttt")

      // console.log(teste);
      // console.log(colors, "dd")

    }
    if (loadingMore.classList.contains("disabled") && filtroGlobal.length > limit) {
      loadingMore.classList.remove("disabled")
      // loadingMore.setAttribute("disabled", "");
      // console.log("aloo")
    }
  })
})


function filterColor(color, filtro) {

  color.forEach((colorItem) => {
    const filter = dataProducts.filter((item) => {
      return item.color.toLocaleUpperCase() === colorItem.toLocaleUpperCase();
    })
    // console.log(filtroGlobal, "filtro antes ")
    // console.log(filtro, "filtro!")
    filtroGlobal = [...filtroGlobal, ...filter]
    // console.log(dataProducts, "dataproducts")
    // console.log(filtroGlobal, "Estou Testando filtro depois", colorItem);
    clearProducts();
    renderProducts(filtroGlobal);
    order();
  })

}

// loading more

const loadingMore = document.querySelector(".loading-more");
loadingMore.addEventListener("click", () => {
  // limit += 3;
  if (filtroGlobal.length > limit) {
    limit = filtroGlobal.length;
    // loadingMore.remove();
    // loadingMore.setAttribute("disabled", true);
    loadingMore.classList.add("disabled")
    clearProducts();
    renderProducts(filtroGlobal)

  } else {
    alert("nao tem mais");
    // console.log(filtroGlobal)
  }

})