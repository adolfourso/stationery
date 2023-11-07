function replaceElementChildren(idOrElement, replacement) {
  const oldChildren = document.createDocumentFragment();

  let parentElement = idOrElement;
  if (typeof idOrElement === "string") {
    parentElement = document.getElementById(idOrElement);
  }
  while (parentElement.hasChildNodes()) {
    oldChildren.appendChild(
      parentElement.removeChild(parentElement.firstChild)
    );
  }
  parentElement.appendChild(replacement);

  return oldChildren;
}

function createLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  for (let i = 0; i < 12; i++) {
    spinner.appendChild(document.createElement("div"));
  }

  return spinner;
}

export { replaceElementChildren, createLoadingSpinner };