function isBlankOrEmpty(chain) {
  return (chain === undefined || typeof chain !== "string" || chain.match(/^[ \t\n\r]*$/) !== null);
}

export { isBlankOrEmpty };