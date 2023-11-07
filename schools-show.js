function createItemGradeInfraestructure(gradeItem) {
  const gradeLabel = document.createElement("label");
  gradeLabel.classList.add("grade-label");
  gradeLabel.appendChild(document.createTextNode(gradeItem.id));

  const gradeLink = document.createElement("a");
  gradeLink.classList.add("grade-link");
  gradeLink.href = `products.html?csv=${gradeItem.productsFile}`;
  gradeLink.appendChild(gradeLabel);

  return gradeLink;
}

function createItemInfraestructure(item) {
  const schoolContainer = document.createElement("div");
  schoolContainer.classList.add("school-section");

  const schoolTitle = document.createElement("h5");
  schoolTitle.classList.add("school-title");
  schoolTitle.appendChild(document.createTextNode(item.id));

  schoolContainer.appendChild(schoolTitle);

  item.grades.forEach((gradeItem) => {
    schoolContainer.appendChild(createItemGradeInfraestructure(gradeItem));
    schoolContainer.appendChild(document.createElement("br"));
  });

  return schoolContainer;
}

function createInfraestructure(items) {
  const infraestructure = document.createDocumentFragment();

  items.forEach((item) => {
    infraestructure.appendChild(createItemInfraestructure(item));
  });

  return infraestructure;
}

export { createInfraestructure };