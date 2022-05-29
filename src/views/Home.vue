<template>
  <section class="cli__wrapper">
    <div class="cli__body">
      <p
        class="cli__body__record"
        v-for="record in cli"
        :key="record.id"
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

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useStore } from "@/stores/cli";
import { useDeclensionWordByNumber } from "@/composables/declensionWord";

const store = useStore();
const cli = reactive([]);
const history = reactive([]);
const historyIndex = ref(-1);
const userInputValue = ref("");
const userInput = ref(null);

const commands = {
  help() {
    const text = `Вы можете использовать следующие методы:
version            Отображает текущую версию CLI
whois              Отображает информацию о создателе
skills             Отображает инофрмацию об умениях
copyright          Отображает информацию о правах на использование
projects           Отображает информацию о моих проектах
experience         Отображает информацию об опыте работы
localdatetime      Отображает текущие дату и время
cls                Отчистить окно консоли`;
    addRecord(text);
  },
  version() {
    displayVersion();
  },
  whois() {
    const ageDifMs = Date.now() - new Date(2001, 4, 28).getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const text = `Ghosterbeef(Ghosteak) - мой цифровой псевдоним под которым вы можете найти меня в соцсетях и играх. На самом деле меня зовут Антон. Мне ${age} ${useDeclensionWordByNumber(age)}.
Я Frontend разработчик, специализируюсь на разработке SPA (Одностраничных приложений) с помощью фреймворка Vue.js. Возможно вы найдете что-то полезное на моей странице в GitHub. (https://github.com/Ghosterbeef)
Я безумно люблю Vue.js и разрабатывать пользовательские интерфейсы, но кроме этого я люблю играть в игры, (Battlefield 3 - 2042, Overwatch, Dying Light и т.д.), кушать вредную еду и являюсь заложником экосистемы Samsung 🆘.`;
    addRecord(text);
  },
  skills() {
    const text = `Технология/навый    Уровень владения
HTML                100lvl
CSS (SCSS)          100lvl
JS                  Junior +
D3.js               Прошу не надо 🥺
Vue.js              Godlike ✌️
Node.js             Hello world
Nuxt.js             Ждем релиза Nuxt3
Nativescript        Вам оно надо? 🙃
React               😡
React Native        🤬
MySQL               select *?
UI/UX               Консультант`;
    addRecord(text);
  },
  copyright() {
    displayCopyright();
  },
  experience() {
    const text = `Компания        Время        Технология
Joydev          3 месяца     Vue.js
It-Pelag        2 месяца     Vue.js`;
    addRecord(text);
  },
  projects() {
    const text = `Все проекты, над которыми я работал:
- AmfyStructures
  (Завершен)     #vuejs:
  Одностраничное веб - приложение, созданное Ghosterbeef, для изучения пользовательских структур для хранения данных и способов их визуализации в языке javascript.
  (https://amfystructures.herokuapp.com/)
- WidgetPortfolio
  (Заморожен)    #vuejs:
  Попытка создать приложение, позволяющее пользователю расширять функционал по мере необходимости. Проект временно заморожен.
  (https://widgetportfolio.herokuapp.com/)
- 4thYear
  (Завершен)     #vuejs
  Обностраничное приложение, созданное для размещения выполнений и отчетов по лабораторным работам 4го курса обучения.
  (https://thyear-3e949.web.app/)
- Агрегатор
  (В разработке) #vuejs #nodejs:
  Дипломный проект, разрабатываемый Ghosterbeef (Front-end + Design) и ByAmfy (Back-end + Design). Проект предполагает реализацию сервиса-агрегатора, включающего в себя интернет-магазин игрушек и сервис по бронированию размещения в гостиннице.
  (https://vvv-holding-home.web.app/)`;
    addRecord(text);
  },
  localdatetime() {
    const text = new Date().toLocaleString();
    addRecord(text);
  },
  cls() {
    cli.length = 0;
  },
  _notFound(command) {
    const text = `Неизвестная команда ${command}. Используйте команду 'help', чтобы отобразить все доступные методы CLI.`;
    addRecord(text);
  }
};

const addRecord = (text, spacer = true) => {
  cli.push({
    id: Math.random(),
    text: text
  });
  if (!spacer) return;
  cli.push({ id: Math.random(), text: " " });
};

const displayGreetings = () => {
  addRecord(`Вас приветствует веб-интерфейс GhosterbeefCLI. Напишите help, чтобы узнать, что я могу для вас сделать.`);
};

const displayVersion = () => {
  addRecord(`GhosterbeefCLI [Version ${store.version}]`, false);
};

const displayCopyright = () => {
  addRecord(`Ghosterbeef (Ghosteak). Все права защищены.`, false);
};

const onEnterPressed = () => {
  addRecord(`${store.prefix} ${userInputValue.value}`, false);
  if (userInputValue.value) {
    history.push(userInputValue.value);
    if (!(userInputValue.value in commands)) {
      commands._notFound(userInputValue.value);
    } else {
      commands[userInputValue.value]?.();
    }
  }
  userInputValue.value = "";
  historyIndex.value = -1;
};

const onEscPressed = () => {
  userInputValue.value = "";
};

const onTabPressed = () => {
  if (!userInputValue.value) return;
  const methods = Object.keys(commands);
  const filteredMethods = methods.filter(key => key.startsWith(userInputValue.value));
  userInputValue.value = filteredMethods[0] || userInputValue.value;
};

const onUpPressed = () => {
  if (!history.length) return;
  if (historyIndex.value === -1) {
    historyIndex.value = history.length - 1;
  } else {
    historyIndex.value--;
  }
  userInputValue.value = history[historyIndex.value];
};

const onDownPressed = () => {
  if (!history.length) return;
  if (historyIndex.value === -1 || historyIndex.value > history.length) {
    historyIndex.value = 0;
  } else {
    historyIndex.value++;
  }
  userInputValue.value = history[historyIndex.value];
};

const focusUserInput = () => {
  userInput.value.focus();
};

const onKeyDown = () => {
  userInput.value.focus();
};

onMounted(async () => {
  document.addEventListener("keydown", onKeyDown);
  displayVersion();
  displayCopyright();
  displayGreetings();
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
