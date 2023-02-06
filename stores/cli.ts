import {defineStore} from "pinia";
import * as VOCABULARY from "@/data/vocabulary.json";
import {CLI_COMMANDS, SYSTEM_COMMANDS} from "@/composables/cliCommands";

interface State {
  cli: { id: number, text: string }[]
  history: string[],
  prefix: string
}

export type {State};

export const useStore = defineStore({
  id: "cli",
  state: (): State => ({
    cli: [
      {id: 1, text: CLI_COMMANDS.find(c => c.trigger === VOCABULARY.APP_VERSION_TRIGGER)?.action || ""},
      {id: 2, text: CLI_COMMANDS.find(c => c.trigger === VOCABULARY.APP_COPYRIGHT_TRIGGER)?.action || ""},
      {id: 3, text: VOCABULARY.APP_GREETINGS},
      {id: 4, text: " "}
    ],
    history: [],
    prefix: "GhosterbeefCLI>"
  }),
  getters: {
    commandComplete: () => (start: string) => {
      const triggers = [
        ...CLI_COMMANDS.map(command => command.trigger),
        ...SYSTEM_COMMANDS.filter(command => command.userAvailable)
          .map(command => command.trigger)
      ];
      return triggers.find(trigger => trigger.startsWith(start)) || start;
    },
    historyRecord: (state) => (index: number) =>
      state.history[index],
    cliCommand: () =>
      (trigger: string) =>
        !!CLI_COMMANDS.find(command => command.trigger === trigger),
    systemCommand: () =>
      (trigger: string) =>
        !!SYSTEM_COMMANDS.find(command => command.trigger === trigger),
    systemAction: (state) =>
      (trigger: string, command: string) =>
        SYSTEM_COMMANDS.find(command => command.trigger === trigger)?.action(command, state as State),
    commandAction: () =>
      (trigger: string) => {
        return CLI_COMMANDS.find(command => command.trigger === trigger)?.action
      }
  },
  actions: {
    actionCall(trigger: string) {
      this.addHistoryRecord(trigger);
      if (!this.cliCommand(trigger) && !this.systemCommand(trigger)) {
        this.addRecord(this.systemAction(VOCABULARY.SYSTEM_NOT_FOUND_TRIGGER, trigger));
        return;
      }
      if (this.cliCommand(trigger)) {
        this.addRecord(this.commandAction?.(trigger) || "");
      }
      this.systemAction(trigger, trigger);
    },
    addRecord(text: string, spacer = true) {
      this.cli.push({
        id: Math.random(),
        text: text
      });
      if (!spacer) return;
      this.cli.push({id: Math.random(), text: " "});
    },
    addHistoryRecord(record: string) {
      this.history.push(record);
    }
  }
});
