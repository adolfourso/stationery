import { isBlankOrEmpty } from "./utils.js";
import { replaceElementChildren } from "./dom-utils.js";
import { createInfraestructure as createSchoolsInfraestructure } from "./schools-show.js";

const CSV_COLUMN_SEPARATOR = ",";

function checkNotRepeatedGrade(grades, gradeId, school) {
  if (grades.find((grade) => {
    return (grade.id === gradeId);
  }) !== undefined) {
    throw new Error(`Contenido erróneo. El grado '${gradeId}' existe dos veces para la escuela '${school}'.`);
  }
}

function ensureSchoolItem(items, itemId) {
  let schoolItem = items.find((item) => {
    return (item.id === itemId);
  });

  if (schoolItem === undefined) {
    schoolItem = {
      id: itemId,
      grades: []
    }
    items.push(schoolItem);
  }

  return schoolItem;
}

function readSchoolsCSV(content) {
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

    const school = rowColumns[0];
    const grade = rowColumns[1];
    const gradeProductsFile = rowColumns[2];

    const schoolItem = ensureSchoolItem(items, school);
    checkNotRepeatedGrade(schoolItem.grades, grade, school);

    schoolItem.grades.push({
      id: grade,
      productsFile: gradeProductsFile
    });
  }

  return items;
}

function loadSchoolsCSV(schoolsCSV, targetContainerId) {
  const schools = readSchoolsCSV(schoolsCSV);

  const infraestructure = document.createDocumentFragment();
  infraestructure.appendChild(createSchoolsInfraestructure(schools));

  replaceElementChildren(targetContainerId, infraestructure);
}

async function retrieveCSVFile(targetURI) {
  const response = await fetch(targetURI);
  if (response.status !== 200) {
    throw new Error("No se puede encontrar el archivo con las escuelas.");
  }
  return await response.text();
}

async function loadSchools(targetURI, targetContainerId) {
  try {
    loadSchoolsCSV(await retrieveCSVFile(targetURI), targetContainerId);
  } catch (e) {
    document.body.innerHTML = e.message;
    throw e;
  }
}


export { loadSchools };