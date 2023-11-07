import { isBlankOrEmpty } from "./utils.js";
import { replaceElementChildren } from "./dom-utils.js";
import { createInfraestructure as createStationeryInfraestructure } from "./stationery-show.js";
import { createInfraestructure as createStationeryExportInfraestructure } from "./stationery-export.js";

const CSV_COLUMN_SEPARATOR = ",";

function checkValidPrice(price, variantId, productId) {
  if (isNaN(price) || !isFinite(price)) {
    throw new Error(`Contenido erróneo. No se puede reconocer el precio de la variante o marca '${variantId}' del producto '${productId}'.`);
  }
  // I am accepting "free" product variants.
  if (price < 0) {
    throw new Error(`Contenido erróneo. La variante o marca '${variantId}' del producto '${productId}' tiene un precio negativo.`);
  }
}

function checkNotRepeatedVariant(variants, variantId, productId) {
  if (variants.find((variant) => {
    return (variant.id === variantId);
  }) !== undefined) {
    throw new Error(`Contenido erróneo. La variante o marca '${variantId}' existe dos veces para el tipo de producto '${productId}'.`);
  }
}

function ensureProductItem(items, itemId) {
  let productItem = items.find((item) => {
    return (item.id === itemId);
  });

  if (productItem === undefined) {
    productItem = {
      id: itemId,
      variants: []
    }
    items.push(productItem);
  }

  return productItem;
}

function readProductsCSV(content) {
  const items = [];

  const rows = content.split("\n");
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    if (isBlankOrEmpty(row)) {
      continue;
    }
    const rowColumns = row.split(CSV_COLUMN_SEPARATOR);

    if (rowColumns.length != 3) {
      throw new Error(`Archivo erróneo. Se espera que todas las filas tengan 3 columnas. La fila:${rowIndex + 1} tiene ${rowColumns.length}.`);
    }

    for (let colIndex = 0; colIndex < 3; colIndex++) {
      if (isBlankOrEmpty(rowColumns[colIndex])) {
        throw new Error(`Archivo erróneo. Se espera un contenido (no vacío ni "en blanco") en cada celda. Error en la celda fila:${rowIndex + 1} - columna:${colIndex + 1}.`);
      }
    }

    const productType = rowColumns[0];
    const productVariant = rowColumns[1];
    const productVariantPrice = parseFloat(rowColumns[2]);

    const productItem = ensureProductItem(items, productType);
    checkNotRepeatedVariant(productItem.variants, productVariant, productType);
    checkValidPrice(productVariantPrice, productVariant, productType);

    productItem.variants.push({
      id: productVariant,
      price: productVariantPrice
    });
  }

  return items;
}

function recalculateLabelColumnWidths() {
  let widerLabelColumn = 0;
  [...document.body.querySelectorAll(".variant-label-column")].forEach((cell) => {
    const cellWidth = parseFloat(window.getComputedStyle(cell).width);
    if (cellWidth > widerLabelColumn) {
      widerLabelColumn = cellWidth;
    }
  });
  [...document.body.querySelectorAll(".variant-label-column")].forEach((cell) => {
    cell.style.width = `${widerLabelColumn}px`;
  });
}

function loadProductsCSV(productsCSV, targetContainerId) {
  const products = readProductsCSV(productsCSV);

  const infraestructure = document.createDocumentFragment();
  infraestructure.appendChild(createStationeryInfraestructure(products));
  infraestructure.appendChild(createStationeryExportInfraestructure());

  replaceElementChildren(targetContainerId, infraestructure);

  recalculateLabelColumnWidths();
}

async function retrieveCSVFile(targetURI) {
  const response = await fetch(targetURI);
  if (response.status !== 200) {
    throw new Error("No se puede encontrar el archivo con los productos.");
  }
  return await response.text();
}

async function loadProducts(targetURI, targetContainerId) {
  try {
    loadProductsCSV(await retrieveCSVFile(targetURI), targetContainerId);
  } catch (e) {
    document.body.innerHTML = e.message;
    throw e;
  }
}


export { loadProducts };