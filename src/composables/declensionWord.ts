import type { Ref } from "vue";
import { computed, isRef, ref } from "vue";

export function useDeclensionWordByNumber(
  number: Ref<number> | number,
  wordForms: Ref<[string, string, string]> = ref<[string, string, string]>([
    "год",
    "года",
    "лет",
  ])
) {
  const numberRef = isRef(number) ? number : ref(number);
  const tempNum = computed(() => numberRef.value % 100);
  const tempNum1 = computed(() => tempNum.value % 10);
  if (tempNum.value > 10 && tempNum.value < 20) {
    return wordForms.value[2];
  }
  if (tempNum1.value > 1 && tempNum1.value < 5) {
    return wordForms.value[1];
  }
  if (tempNum1.value === 1) {
    return wordForms.value[0];
  }
  return wordForms.value[2];
}
