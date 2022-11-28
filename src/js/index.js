let dataProducts = [];
let filtroGlobal = [];
let filterPriceGlobal = [];
let order = highPriceds;
let limiteAtual = 6;
let cartItens = 0;

fetchProducts();

//carrinho implementação
const cartItem = document.querySelector(".cartItem");

// filtro seleção
const iconCart = document.querySelector(".icon-cart");
const filterSelect = document.querySelector(".filter-select");
const filterOption = document.querySelector(".filter-options");
const filterMobile = document.querySelector(".filterMobile.order");

filterSelect.addEventListener("click", () => {
  filterOption.classList.toggle("active");
});

//moreColors

const moreColors = document.querySelector(".more-colors");
const moreColorsData = document.querySelector("[data-moreColors]");
moreColors.addEventListener("click", () => {
  if (moreColorsData.dataset.morecolors === "active") {
    moreColorsData.dataset.morecolors = "";
  } else {
    moreColorsData.dataset.morecolors = "active";
  }
});

// gridSize

const itemSize = document.querySelectorAll(".item-size");
itemSize.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
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
  try {
    const data = await fetch("http://localhost:5000/products");
    const response = await data.json();
    dataProducts = response.map((item) => {
      return item;
    });
    filtroGlobal = dataProducts;
    renderProducts(response);
  } catch (error) {
    productsGrid.innerHTML = `
    <div style="color:red;">
      <p style="margin-bottom:10px;">Não foi possivel realizar o carregamento</p> 
      <p>ERRO:${error}</p>
    </div>`;
  }
}

function renderProducts(products) {
  products.forEach((item, index) => {
    if (index < limiteAtual) {
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
  if (loadingMore.classList.contains("disabled") && filtroGlobal.length > 6) {
    loadingMore.classList.remove("disabled");
    limiteAtual = 6;
  }
  const btnCards = document.querySelectorAll(".btn.default");
  btnCards.forEach((item) => {
    item.addEventListener("click", () => {
      cartItem.innerText = cartItens += 1;
    });
  });
  verificaLoad();
}

// ordenação

const highPriced = document.querySelectorAll(".high-priced");
const smallPrice = document.querySelectorAll(".small-price");
const recentSelect = document.querySelectorAll(".recent");

highPriced.forEach((item) => {
  item.addEventListener("click", highPriceds);
});

smallPrice.forEach((item) => {
  item.addEventListener("click", smallPrices);
});

recentSelect.forEach((item) => {
  item.addEventListener("click", recent);
});

function highPriceds() {
  filtroGlobal.sort((a, b) => {
    return a.price < b.price ? 1 : a.price > b.price ? -1 : 0;
  });
  setTimeout(() => {
    filterOption.classList.remove("active");
  }, 800);
  if (filterMobile.classList.contains("active")) {
    filterMobile.classList.remove("active");
  }
  clearProducts();
  renderProducts(filtroGlobal);
  order = highPriceds;
}

function smallPrices() {
  filtroGlobal.sort((a, b) => {
    return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
  });
  setTimeout(() => {
    filterOption.classList.remove("active");
  }, 800);
  if (filterMobile.classList.contains("active")) {
    filterMobile.classList.remove("active");
  }
  clearProducts();
  renderProducts(filtroGlobal);
  order = smallPrices;
}

function recent() {
  filtroGlobal.sort((a, b) => {
    const date1 = new Date(a.date);
    const date2 = new Date(b.date);
    return date2 - date1;
  });
  setTimeout(() => {
    filterOption.classList.remove("active");
  }, 800);

  if (filterMobile.classList.contains("active")) {
    filterMobile.classList.remove("active");
  }
  clearProducts();
  renderProducts(filtroGlobal);
  order = recent;
}

function clearProducts() {
  productsGrid.innerHTML = "";
}

// filtro cor

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

checkboxColors.forEach((item) => {
  item.addEventListener("change", () => {
    if (item.checked && !colors.includes(item.getAttribute("class"))) {
      colors.push(item.getAttribute("class"));
      filtroGlobal = [];
      filterColor(colors, filtroGlobal);
    } else {
      if (!item.checked) {
        colors.splice(colors.indexOf(item.getAttribute("class")), 1);
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
  });
});

checkboxSizes.forEach((item) => {
  item.addEventListener("change", () => {
    if (item.checked && !sizes.includes(item.getAttribute("id"))) {
      sizes.push(item.getAttribute("id"));
      filterSize(sizes, filtroGlobal);
    } else {
      if (!item.checked) {
        sizes.splice(sizes.indexOf(item.getAttribute("id")), 1);
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
    if (item.checked && !prices.includes(item.getAttribute("class"))) {
      prices.push(item.getAttribute("class"));
      filterPrice(prices, filtroGlobal);
    } else {
      if (!item.checked) {
        prices.splice(prices.indexOf(item.getAttribute("class")), 1);
        if (prices.length > 0) {
          filtroGlobal = [];
          filterPrice(prices, filtroGlobal);
        } else {
          clearProducts();
          filtroGlobal = dataProducts;
          renderProducts(dataProducts);
        }
      }
    }
  });
});

function filterColor(color) {
  color.forEach((colorItem) => {
    const filter = dataProducts.filter((item) => {
      return item.color.toLocaleUpperCase() === colorItem.toLocaleUpperCase();
    });
    filtroGlobal = [...filtroGlobal, ...filter];
    clearProducts();
    renderProducts(filtroGlobal);
    order();
  });
}

function filterSize(size) {
  size.forEach((sizeItem) => {
    const filter = filtroGlobal.filter((item) => {
      return item.size[0].toLocaleUpperCase() === sizeItem.toLocaleUpperCase();
    });
    filtroGlobal = [...filter];
    clearProducts();
    renderProducts(filtroGlobal);
  });
}
function filterPrice(prices) {
  prices.forEach((priceItem) => {
    const pricesObj = {
      min: priceItem.split("-")[0],
      max: priceItem.split("-")[1],
    };
    const filter = dataProducts.filter((item) => {
      return item.price >= pricesObj.min && item.price <= pricesObj.max;
    });
    if (prices.length > 1) {
      filtroGlobal = [...filterPriceGlobal, ...filter];
      clearProducts();
      renderProducts(filtroGlobal);
    } else {
      filterPriceGlobal = [...filterPriceGlobal, ...filter];
      filtroGlobal = [...filter];
      clearProducts();
      renderProducts(filtroGlobal);
    }
  });
}

// loading more

const loadingMore = document.querySelector(".loading-more");
loadingMore.addEventListener("click", () => {
  if (filtroGlobal.length > limiteAtual) {
    limiteAtual = filtroGlobal.length;
    clearProducts();
    renderProducts(filtroGlobal);
    loadingMore.classList.add("disabled");
  }
});

function verificaLoad() {
  if (filtroGlobal.length < limiteAtual) {
    loadingMore.classList.add("disabled");
  }
}

// click no filtro mobile
const btnMobile = document.querySelectorAll(".btn.mobile");
const btnCloseMobile = document.querySelectorAll(".btnClose");

btnMobile.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.innerText.toLocaleUpperCase() === "FILTRAR") {
      const filterMobile = document.querySelector(".filterMobile.filter");
      filterMobile.classList.add("active");
    }
    if (item.innerText.toLocaleUpperCase() === "ORDENAR") {
      const filterMobile = document.querySelector(".filterMobile.order");
      filterMobile.classList.add("active");
    }
  });
  btnCloseMobile.forEach((item) => {
    item.addEventListener("click", () => {
      item.parentElement.parentElement.classList.remove("active");
    });
  });
});

// accordion mobile

const btnAccordion = document.querySelectorAll(".arrow-accordion");
btnAccordion.forEach((item) => {
  item.addEventListener("click", (event) => {
    item.parentElement.nextElementSibling.classList.toggle("active");
    event.currentTarget.classList.toggle("active");
  });
});
