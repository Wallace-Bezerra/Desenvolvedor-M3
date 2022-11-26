const serverurl = process.env.SERVER_API;
let dataProducts = [];
let filtroGlobal = [];
let order = highPriceds;
let limit = 6;
console.log("Dev m3", serverurl);

//carrinho implementação
const root = document.querySelector(":root");
const teste = root.style.getPropertyValue("--text");
// console.log(teste)
root.addEventListener("click", () => {
  root.style.setProperty("--text", "'1'");
  // console.log(root.style.getPropertyValue("--text"));
});

// filtro seleção
const iconCart = document.querySelector(".icon-cart");
const filterSelect = document.querySelector(".filter-select");
const filterOption = document.querySelector(".filter-options");

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
  } else {
    moreColorsData.dataset.morecolors = "active";
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
  });
});

// api teste

const productsGrid = document.querySelector(".products-grid");
const options = {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
};
const formatNumber = new Intl.NumberFormat("pt-BR", options);

async function fetchProducts() {
  const data = await fetch("http://localhost:5000/products");
  const response = await data.json();
  //  getProducts(response);
  dataProducts = response.map((item) => {
    return item;
  });
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
      productsGrid.innerHTML += `
          <li class="card-item">
            <img src=${item.image} alt="">
            <div class="card-description">
              <h2 class="card-title">${item.name}</h2>
              <p class="card-price">${formatNumber.format(item.price)}</p>
              <span class="card-parcel">até ${
                item.parcelamento[0]
              }x de ${formatNumber.format(item.parcelamento[1])}</span>
            </div>
            <button class="btn default">COMPRAR</button>
          </li>
      `;
    }
  });
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
    const date1 = new Date(a.date);
    const date2 = new Date(b.date);
    return date2 - date1;
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
  });
  // productsGrid.innerHTML = "";
}

// filtro cor

// preciso deixar esse evento generico e filtrar com

//tentar utilizar dataset
const checkboxColors = document.querySelectorAll(
  "[data-colors='colors'] input[type='checkbox']"
);
const checkboxSizes = document.querySelectorAll(
  "[data-sizes='sizes'] input[type='checkbox']"
);
const checkboxPrices = document.querySelectorAll(
  "[data-prices='prices'] input[type='checkbox']"
);
const colors = [];
const sizes = [];
const prices = [];

console.log(checkboxColors);
console.log(checkboxSizes);
console.log(checkboxPrices);

checkboxColors.forEach((item) => {
  item.addEventListener("change", () => {
    if (item.checked && !colors.includes(item.getAttribute("id"))) {
      colors.push(item.getAttribute("id"));
      filtroGlobal = [];
      filterColor(colors, filtroGlobal);
    } else {
      if (!item.checked) {
        colors.splice(colors.indexOf(item.id), 1);
        if (colors.length > 0) {
          filtroGlobal = [];
          filterColor(colors, filtroGlobal);
        } else {
          clearProducts();
          filtroGlobal = dataProducts;
          renderProducts(dataProducts);
        }
      }
    }

    if (
      loadingMore.classList.contains("disabled") &&
      filtroGlobal.length > limit
    ) {
      loadingMore.classList.remove("disabled");
    }
  });
});

checkboxSizes.forEach((item) => {
  item.addEventListener("change", () => {
    if (item.checked && !sizes.includes(item.getAttribute("id"))) {
      sizes.push(item.getAttribute("id"));
      // filtroGlobal = [];
      console.log(sizes);
      filterSize(sizes, filtroGlobal);
    } else {
      if (!item.checked) {
        sizes.splice(sizes.indexOf(item.id), 1);
        if (sizes.length > 0) {
          filtroGlobal = [];
          filterSize(sizes, filtroGlobal);
        } else {
          clearProducts();
          filtroGlobal = dataProducts;
          renderProducts(dataProducts);
        }
      }
    }
  });
});
checkboxPrices.forEach((item) => {
  item.addEventListener("change", () => {
    if (item.checked && !prices.includes(item.getAttribute("id"))) {
      prices.push(item.getAttribute("id"));
      // filtroGlobal = [];
      console.log(prices);
      // filterSize(price, filtroGlobal);
    }
  });
});

// checkbox.forEach((item) => {
//   const parentElementes = item.parentElement.parentElement.dataset;
//   item.addEventListener("change", (event) => {
//     console.log(filtroGlobal, limit, "consoles")

//     const idItem = event.currentTarget.getAttribute("id");
//     console.log(idItem);

//     // const data = Object.values(JSON.parse(JSON.stringify(teste1)));
//     // console.log(data);
//     // console.log(data[0]);

//     if (item.checked) {
//       checkbox.forEach((item) => {
//         const ife = item.checked && parentElementes.colors === "colors" && !colors.includes(item.getAttribute("id"));
//         console.log(ife,item,parentElementes.colors)
//         if (ife) {
//           console.log(item.getAttribute("id"),"chove");
//           // console.log(data[0],"teste 0000")
//           console.log("colors antes",colors)
//           colors.push(item.getAttribute("id"));
//           // console.log(item, "checked")
//           // console.log(colors);
//           console.log(colors,"colors depois");
//           filtroGlobal = []
//           filterColor(colors, filtroGlobal)
//           // console.log(filtroGlobal, "globals")
//         }
//         // if((item.checked && parentElementes.sizes === "sizes" && !sizes.includes(item.getAttribute("id")))){
//         //   console.log(sizes,"sizes antes")
//         //   // sizes.push(item.getAttribute("id"));
//         //   // filtroGlobal = []
//         //   console.log(sizes,"sizes depois");
//         //   // filterSize(sizes, filtroGlobal);
//         // }

//       })
//     }
//     else {
//       // clearProducts();

//       // const teste = colors.slice(colors.indexOf(item.id), 2);
//       // colors.push("fudeu")
//       // console.log("deu certo")
//       // console.log(colors.indexOf(item.id));
//       // console.log(item.id)
//       if (!item.checked ) {

//         if (colors.length > 0 && parentElementes.colors === "colors") {
//           colors.splice(colors.indexOf(item.id), 1);
//           // console.log(colors, "cores")
//           filtroGlobal = [];
//           // console.log("filtrado..")
//           filterColor(colors, filtroGlobal)
//           console.log("filtrou")
//           // console.log(filtroGlobal, "teste Global");
//         }

//         // if(sizes.length > 0 && data[0] === "sizes"){
//         //   sizes.splice(sizes.indexOf(item.id), 1);
//         //   filtroGlobal = [];
//         //   console.log("filtrou size")
//         //   console.log(sizes)
//         //   // filterSize(colors, filtroGlobal)
//         //   clearProducts();
//         //   filtroGlobal = dataProducts;
//         //   renderProducts(dataProducts);
//         // }
//         else {
//           clearProducts();
//           filtroGlobal = dataProducts;
//           renderProducts(dataProducts);
//           console.log("limpou")
//         }

//       }
//     }
//     if (loadingMore.classList.contains("disabled") && filtroGlobal.length > limit) {
//       loadingMore.classList.remove("disabled")
//       // loadingMore.setAttribute("disabled", "");
//       // console.log("aloo")
//     }
//   })
// })

function filterColor(color, filtro) {
  color.forEach((colorItem) => {
    console.log(filtroGlobal, "global");
    const filter = dataProducts.filter((item) => {
      return item.color.toLocaleUpperCase() === colorItem.toLocaleUpperCase();
    });
    // console.log(filtroGlobal, "filtro antes ")
    // console.log(filtro, "filtro!")
    filtroGlobal = [...filtroGlobal, ...filter];
    // console.log(dataProducts, "dataproducts")
    console.log(filtroGlobal, "Estou Testando filtro depois", colorItem);
    clearProducts();
    renderProducts(filtroGlobal);
    order();
  });
}

function filterSize(size, filtro) {
  size.forEach((sizeItem) => {
    console.log(filtroGlobal);
    console.log(sizeItem, "sizeee");
    const filter = filtroGlobal.filter((item) => {
      return item.size[0].toLocaleUpperCase() === sizeItem.toLocaleUpperCase();
    });
    // console.log(filtroGlobal, "filtro antes ")
    // console.log(filtro, "filtro!")
    filtroGlobal = [...filter];
    // console.log(dataProducts, "dataproducts")
    console.log(filtroGlobal, "Estou Testando filtro depois", sizeItem);
    clearProducts();
    renderProducts(filtroGlobal);
    // order();
  });
}

// loading more

const loadingMore = document.querySelector(".loading-more");
loadingMore.addEventListener("click", () => {
  // limit += 3;
  if (filtroGlobal.length > limit) {
    limit = filtroGlobal.length;
    // loadingMore.remove();
    // loadingMore.setAttribute("disabled", true);
    loadingMore.classList.add("disabled");
    clearProducts();
    renderProducts(filtroGlobal);
  } else {
    alert("nao tem mais");
    // console.log(filtroGlobal)
  }
});
