import { useDeclensionWordByNumber } from "@/composables/declensionWord";

class CLICommand {
  help: string;
  trigger: string;
  action: Function;

  constructor(trigger: string, cb: () => string, help: string) {
    this.help = help;
    this.action = cb;
    this.trigger = trigger;
  }
}

const CLI_COMMANDS = Object.freeze([
  new CLICommand(
    "whois",
    () => {
      const ageDifMs = Date.now() - new Date(2001, 4, 28).getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return `Ghosterbeef(Ghosteak) - мой цифровой псевдоним под которым вы можете найти меня в соцсетях и играх. На самом деле меня зовут Антон. Мне ${age} ${useDeclensionWordByNumber(
        age
      )}.
Я Frontend разработчик, специализируюсь на разработке SPA (Одностраничных приложений) с помощью фреймворка Vue.js. Возможно вы найдете что-то полезное на моей странице в GitHub. (https://github.com/Ghosterbeef)
Я безумно люблю Vue.js и разрабатывать пользовательские интерфейсы, но кроме этого я люблю играть в игры, (Battlefield 3 - 2042, Overwatch, Dying Light и т.д.), кушать вредную еду и являюсь заложником экосистемы Samsung 🆘.`;
    },
    "Отображает информацию о создателе"
  ),
  new CLICommand(
    "skills",
    () => {
      return "";
    },
    "Отображает информацию об умениях"
  ),
]);

export default CLI_COMMANDS;
