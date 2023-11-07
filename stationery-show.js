import { replaceElementChildren } from "./dom-utils.js";

function updateTotalPrice(totalPrice) {
  document.getElementById("total-price").value = totalPrice;
  replaceElementChildren("total-price-value", document.createTextNode(totalPrice.toFixed(2)));
}

function onVariantPicked(event) {
  const total = [...document.querySelectorAll(".variant-quantity")]
    .reduce((total, current) => {
      return total + (current.value * current.dataset.price);
    }, 0)
  updateTotalPrice(total);
}

function createMonetarySignLabel() {
  const monetarySignLabel = document.createElement("label");
  monetarySignLabel.classList.add("monetary-sign-label");
  monetarySignLabel.appendChild(document.createTextNode("$"));

  return monetarySignLabel;
}

function createTotalPriceInfraestructure() {
  const totalPriceContainer = document.createElement("div");
  totalPriceContainer.classList.add("total-price-container");

  const priceTitleLabel = document.createElement("label");
  priceTitleLabel.classList.add("total-price-title");
  priceTitleLabel.appendChild(document.createTextNode("Total:"));

  totalPriceContainer.appendChild(priceTitleLabel);

  totalPriceContainer.appendChild(createMonetarySignLabel());

  const priceValueLabel = document.createElement("label");
  priceValueLabel.classList.add("total-price-value");
  priceValueLabel.id = "total-price-value";
  priceValueLabel.appendChild(document.createTextNode("0.00"));

  totalPriceContainer.appendChild(priceValueLabel);

  const totalPrice = document.createElement("input");
  totalPrice.type = "hidden";
  totalPrice.value = "0";
  totalPrice.id = "total-price";

  totalPriceContainer.appendChild(totalPrice);

  return totalPriceContainer;
}

function createItemVariantRowInfraestructure(variant, productType) {
  const variantRow = document.createElement("tr");
  variantRow.classList.add("variant-row");

  const variantCheckboxCell = document.createElement("td");
  variantCheckboxCell.classList.add("variant-checkbox-column");
  
  const variantQuantity = document.createElement("input");
  variantQuantity.classList.add("variant-quantity");
  variantQuantity.type = "number";
  variantQuantity.dataset.price = variant.price;
  variantQuantity.dataset.productType = productType;
  variantQuantity.dataset.variant = variant.id;
  variantQuantity.value = 0;
  variantQuantity.min = 0;
  variantQuantity.step = 1;
  variantQuantity.addEventListener("keypress", (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  });
  variantQuantity.addEventListener("input", (event) => {
    if (/^0/.test(event.target.value) && event.target.value !== "0") {
      event.target.value = event.target.value.replace(/^0*/, "");
    }
  });
  variantQuantity.addEventListener("input", onVariantPicked);

  variantCheckboxCell.appendChild(variantQuantity);
  variantRow.appendChild(variantCheckboxCell);

  const variantLabelCell = document.createElement("td");
  variantLabelCell.classList.add("variant-label-column");

  const variantLabel = document.createElement("label");
  variantLabel.classList.add("variant-label");
  variantLabel.appendChild(document.createTextNode(variant.id));

  variantLabelCell.appendChild(variantLabel);
  variantRow.appendChild(variantLabelCell);

  const variantPriceCell = document.createElement("td");
  variantPriceCell.classList.add("variant-price-column");

  variantPriceCell.appendChild(createMonetarySignLabel());

  const variantPriceLabel = document.createElement("label");
  variantPriceLabel.classList.add("variant-price");
  variantPriceLabel.appendChild(document.createTextNode(variant.price));

  variantPriceCell.appendChild(variantPriceLabel);
  variantRow.appendChild(variantPriceCell);

  return variantRow;
}

function createItemInfraestructure(item) {
  const itemContainer = document.createElement("div");
  itemContainer.classList.add("item-section");

  const itemTitle = document.createElement("h5");
  itemTitle.classList.add("item-title");
  itemTitle.appendChild(document.createTextNode(item.id));

  itemContainer.appendChild(itemTitle);

  const itemTable = document.createElement("table");

  item.variants.forEach((variant) => {
    itemTable.appendChild(createItemVariantRowInfraestructure(variant, item.id));
  });

  itemContainer.appendChild(itemTitle);
  itemContainer.appendChild(itemTable);

  return itemContainer;
}

function createInfraestructure(items) {
  const infraestructure = document.createDocumentFragment();

  items.forEach((item) => {
    infraestructure.appendChild(createItemInfraestructure(item));
  });

  infraestructure.appendChild(createTotalPriceInfraestructure());

  return infraestructure;
}

export { createInfraestructure };