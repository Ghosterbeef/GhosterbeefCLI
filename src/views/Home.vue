<template>
  <section class="cli__wrapper">
    <div class="cli__body">
      <p
        class="cli__body__record"
        v-for="record in store.cli"
        :key="record.id"
        ref="cliRecords"
      >
        {{ record.text }}
      </p>
      <div class="cli__body__user-input" @click="focusUserInput">
        <p>
          {{ store.prefix }}
          <textarea
            autofocus
            ref="userInput"
            class="background-input"
            v-model="userInputValue"
            @keydown.enter.prevent.stop="onEnterPressed"
            @keydown.esc.prevent.stop="onEscPressed"
            @keydown.tab.prevent.stop="onTabPressed"
            @keydown.up.prevent.stop="onUpPressed"
            @keydown.down.prevent.stop="onDownPressed"
            @keydown.left.prevent.stop
            @keydown.right.prevent.stop
          />
          <span class="user-input">{{ userInputValue }}</span>
          <span class="caret">&ensp;</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "@/stores/cli";
import type { Ref } from "vue";

const store = useStore();
const historyIndex = ref(-1);
const userInputValue = ref("");
const cliRecords = ref<null | Ref<HTMLElement[]>>(null);
const userInput = ref<null | HTMLTextAreaElement>(null);

const onEnterPressed = () => {
  store.addRecord(`${store.prefix} ${userInputValue.value}`, false);
  const trigger = userInputValue.value;
  userInputValue.value = "";
  historyIndex.value = -1;
  if (!trigger) return;
  store.actionCall(trigger);
};

const onEscPressed = () => {
  userInputValue.value = "";
};

const onTabPressed = () => {
  if (!userInputValue.value) return;
  userInputValue.value = store.commandComplete(userInputValue.value);
};

const onUpPressed = () => {
  if (!store.history.length) return;
  if (historyIndex.value === -1) {
    historyIndex.value = store.history.length - 1;
  } else {
    historyIndex.value--;
  }
  userInputValue.value = store.historyRecord(historyIndex.value);
};

const onDownPressed = () => {
  if (!store.history.length) return;
  if (historyIndex.value === -1 || historyIndex.value === store.history.length) {
    historyIndex.value = 0;
  } else {
    historyIndex.value++;
  }
  userInputValue.value = store.historyRecord(historyIndex.value);
};

const focusUserInput = () => {
  userInput.value?.focus();
};

const onKeyDown = () => {
  userInput.value?.focus();
};

watch(cliRecords, (val) => {
  if (!val) return;

  const last = val[val.length - 1];
  if (!last) return;

  last.scrollIntoView({ behavior: "smooth", block: "center" });
}, { deep: true });

onMounted(async () => {
  document.addEventListener("keydown", onKeyDown);
  store.initialRender();
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
});
</script>

<style scoped lang="scss">
.cli__wrapper {
  flex: 1;
  overflow-y: scroll;
}

.cli__body {
  padding: 10px;
  height: 1px;
  min-height: 700%;
  isolation: isolate;

  &__record {
    white-space: pre-wrap;
  }

  &__user-input {
    height: 100%;
    position: relative;

    .background-input {
      position: absolute;
      opacity: 0;
      inset: 0;
      outline: none;
      z-index: -1;
    }

    .background-input:focus-visible ~ .caret {
      background-color: var(--color-text);
      animation: blink 1s step-end infinite;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        height: 75%;
        background-color: var(--color-background);
      }
    }

    .user-input {
      white-space: pre;
    }

    .caret {
      position: relative;
    }
  }
}

@keyframes blink {
  from,
  to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
