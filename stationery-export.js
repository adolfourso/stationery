import { saveAs } from "./file-saver.js"

const CSV_COLUMN_SEPARATOR = ",";

function getCsvData() {
  return Array.from(document.querySelectorAll(".variant-quantity"))
    .filter((item) => {
      return (Number(item.value) > 0);
    })
    .map((item) => {
      return `${item.value}${CSV_COLUMN_SEPARATOR}${item.dataset.productType}${CSV_COLUMN_SEPARATOR}${item.dataset.variant}${CSV_COLUMN_SEPARATOR}${item.dataset.price}`;
    })
    .reduce((rows, row) => {
      return `${rows}${row}\n`;
    }, "");
}

function exportFile() {
  saveAs(new Blob([getCsvData()], { type: "text/csv" }), "articulos-libreria-seleccionados.csv");
}

function createInfraestructure() {
  const infraestructure = document.createElement("div");
  infraestructure.classList.add("export-button-container");

  const exportButton = document.createElement("button");
  exportButton.classList.add("export-button");
  exportButton.addEventListener("click", exportFile);
  exportButton.appendChild(document.createTextNode("Extraer selección"));

  infraestructure.appendChild(exportButton);

  return infraestructure;
}

export { createInfraestructure };