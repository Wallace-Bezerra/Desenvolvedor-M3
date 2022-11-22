const serverurl = process.env.SERVER_API;

console.log("Dev m3", serverurl);

//carrinho implementação
const root = document.querySelector(":root")
const teste  = root.style.getPropertyValue("--text");
console.log(teste)
root.addEventListener("click",()=>{
  root.style.setProperty("--text", "'1'");
  console.log(root.style.getPropertyValue("--text"));
});


// filtro seleção
const iconCart = document.querySelector(".icon-cart")
const filterSelect = document.querySelector(".filter-select")
const filterOption = document.querySelector(".filter-options")

filterSelect.addEventListener("click",()=>{
    filterOption.classList.toggle("active");
});

//moreColors

const moreColors = document.querySelector(".more-colors");
const moreColorsData = document.querySelector("[data-moreColors]");
moreColors.addEventListener("click",()=>{
  // moreColors.dataset.dataMoreColors = "active";
  if(moreColorsData.dataset.morecolors === "active"){
    moreColorsData.dataset.morecolors = "";
  }
  else{
    moreColorsData.dataset.morecolors = "active"
  }
  console.log(moreColorsData.dataset.morecolors);
});

// gridSize

const itemSize = document.querySelectorAll(".item-size");
console.log(itemSize);
itemSize.forEach((item)=>{
  item.addEventListener("click",()=>{
    item.classList.toggle("active");
    // console.log(item);
  })
})
