import { defineStore } from "pinia";
import * as VOCABULARY from "@/data/vocabulary.json";
import { CLI_COMMANDS, SYSTEM_COMMANDS } from "@/composables/cliCommands";

interface State {
  cli: { id: number, text: string }[]
  cliCommands: typeof CLI_COMMANDS
  systemCommands: typeof SYSTEM_COMMANDS
  history: string[],
  prefix: string
}

export type { State };

export const useStore = defineStore({
  id: "cli",
  state: (): State => ({
    cli: [],
    cliCommands: CLI_COMMANDS,
    systemCommands: SYSTEM_COMMANDS,
    history: [],
    prefix: "GhosterbeefCLI>"
  }),
  getters: {
    commandComplete: (state) => (start: string) => {
      const triggers = [
        ...state.cliCommands.map(command => command.trigger),
        ...state.systemCommands.filter(command => command.userAvailable)
          .map(command => command.trigger)
      ];
      return triggers.find(trigger => trigger.startsWith(start)) || start;
    },
    historyRecord: (state) => (index: number) =>
      state.history[index],
    cliCommand: (state) =>
      (trigger: string) =>
        !!state.cliCommands.find(command => command.trigger === trigger),
    systemCommand: (state) =>
      (trigger: string) =>
        !!state.systemCommands.find(command => command.trigger === trigger),
    systemAction: (state) =>
      (trigger: string, command: string) =>
        state.systemCommands.find(command => command.trigger === trigger)?.action(command, state as State),
    commandAction: (state) =>
      (trigger: string) =>
        state.cliCommands.find(command => command.trigger === trigger)?.action
  },
  actions: {
    initialRender() {
      this.addRecord(this.commandAction(VOCABULARY.APP_VERSION_TRIGGER)!, false);
      this.addRecord(this.commandAction(VOCABULARY.APP_COPYRIGHT_TRIGGER)!, false);
      this.addRecord(VOCABULARY.APP_GREETINGS);
    },
    actionCall(trigger: string) {
      this.addHistoryRecord(trigger);
      if (!this.cliCommand(trigger) && !this.systemCommand(trigger)) {
        this.addRecord(this.systemAction(VOCABULARY.SYSTEM_NOT_FOUND_TRIGGER, trigger));
        return;
      }
      if (this.cliCommand(trigger)) {
        this.addRecord(this.commandAction(trigger)!);
      }
      this.systemAction(trigger, trigger);
    },
    addRecord(text: string, spacer = true) {
      this.cli.push({
        id: Math.random(),
        text: text
      });
      if (!spacer) return;
      this.cli.push({ id: Math.random(), text: " " });
    },
    addHistoryRecord(record: string) {
      this.history.push(record);
    }
  }
});
