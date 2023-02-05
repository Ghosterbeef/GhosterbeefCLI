import type { Ref } from "vue";
import { computed, isRef, ref } from "vue";


function useDeclensionWordByNumber(
  number: Ref<number> | number,
  wordForms: [string, string, string] = ([
    "год",
    "года",
    "лет"
  ])
) {
  const numberRef = isRef(number) ? number : ref(number);
  const tempNum = computed(() => numberRef.value % 100);
  const tempNum1 = computed(() => tempNum.value % 10);
  if (tempNum.value > 10 && tempNum.value < 20) {
    return wordForms[2];
  }
  if (tempNum1.value > 1 && tempNum1.value < 5) {
    return wordForms[1];
  }
  if (tempNum1.value === 1) {
    return wordForms[0];
  }
  return wordForms[2];
}

function useRenderList(
  items: string[][] | Ref<string[][]>,
  keyValueSeparator: string = ":",
  listSeparator: string = ""
) {
  const itemsRef = isRef(items) ? items : ref(items);

  const longestValuesLengths = itemsRef.value.reduce((acc, cur) => {
    return cur.map((item, i) => item.length > acc[i] ? item.length : acc[i]);
  }, Array.from(Array(itemsRef.value[0].length).keys()).map(_ => 0));

  return itemsRef.value.map((item => {
    const lenDiffs = longestValuesLengths
      .map((length, i) => length - item[i].length);
    return item
      .map((value, i) => {
        if (i === item.length - 1) return value;
        return `${value}${" ".repeat(lenDiffs[i])}`;
      })
      .join(keyValueSeparator);
  })).join(`${listSeparator}\n`);
}

function useDatesDifference(date1: Date, date2: Date) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  const days = Math.floor(Math.abs(utc2 - utc1) / MS_PER_DAY);

  if (days < 31) return `${days} ${useDeclensionWordByNumber(days, ["день", "дня", "дней"])}`;

  const months = Math.floor(days / 30.4375);

  if (months < 12) return `${months} ${useDeclensionWordByNumber(months, ["месяц", "месяца", "месяцев"])}`;

  const years = Math.floor(months / 12);

  return `${years} ${useDeclensionWordByNumber(years, ["год", "года", "лет"])}`;
}


export { useRenderList, useDeclensionWordByNumber, useDatesDifference };
