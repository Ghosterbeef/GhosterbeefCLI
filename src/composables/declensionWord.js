export function useDeclensionWordByNumber(number, wordForms = ["год", "года", "лет"]) {
  const tempNum = number % 100;
  const tempNum1 = tempNum % 10;
  if (tempNum > 10 && tempNum < 20) {
    return wordForms[2];
  }
  if (tempNum1 > 1 && tempNum1 < 5) {
    return wordForms[1];
  }
  if (tempNum1 === 1) {
    return wordForms[0];
  }
  return wordForms[2];
}
