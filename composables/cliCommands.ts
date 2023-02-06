import * as VOCABULARY from "@/data/vocabulary.json";
import { version } from "./../package.json";
import { useDatesDifference, useDeclensionWordByNumber, useRenderList } from "@/composables/cliRender";
import type { State } from "@/stores/cli";

class SystemCLICommand {
  help?: string;
  trigger: string;
  userAvailable?: boolean;
  private readonly cb: (command: string, state: State) => any;

  constructor(trigger: string, cb: (command: string, state: State) => any, help?: string, userAvailable = false) {
    this.trigger = trigger;
    this.cb = cb;
    this.help = help;
    this.userAvailable = userAvailable;
  }

  action(command: string, state: State) {
    return this.cb(command, state);
  }
}

class CLICommand {
  help: string;
  trigger: string;
  private readonly cb: () => string;

  constructor(trigger: string, cb: () => string, help: string) {
    this.help = help;
    this.cb = cb;
    this.trigger = trigger;
  }

  get action() {
    return this.cb();
  }

  get one() {
    return 1
  }
}

const CLI_COMMANDS: readonly CLICommand[] = Object.freeze([
  new CLICommand(
    VOCABULARY.HELP_TRIGGER,
    () => `${VOCABULARY.HELP}`.replace("$help", `${useRenderList([
        ...CLI_COMMANDS
          .filter(command => command.trigger !== VOCABULARY.HELP_TRIGGER)
          .map(command => [command.trigger, command.help]),
        ...SYSTEM_COMMANDS
          .filter(command => command.userAvailable)
          .map(command => [command.trigger, command.help ?? ""])
      ],
      "   "
    )}`),
    ""
  ),
  new CLICommand(
    VOCABULARY.APP_VERSION_TRIGGER,
    () => VOCABULARY.APP_VERSION.replace("$version", version),
    VOCABULARY.APP_VERSION_HELP
  ),
  new CLICommand(
    VOCABULARY.APP_COPYRIGHT_TRIGGER,
    () => VOCABULARY.APP_COPYRIGHT,
    VOCABULARY.APP_COPYRIGHT_HELP
  ),
  new CLICommand(
    VOCABULARY.WHOIS_TRIGGER,
    () => {
      const ageDifMs = Date.now() - new Date(2001, 4, 28).getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      const ageFragment = `${age} ${useDeclensionWordByNumber(age)}`;
      return VOCABULARY.WHOIS_DESCRIPTION.replace("$age", ageFragment);
    },
    VOCABULARY.WHOIS_HELP
  ),
  new CLICommand(
    VOCABULARY.SKILLS_TRIGGER,
    () => useRenderList(VOCABULARY.SKILLS, "   "),
    VOCABULARY.SKILLS_HELP
  ),
  new CLICommand(
    VOCABULARY.PROJECTS_TRIGGER,
    () => VOCABULARY.PROJECTS,
    VOCABULARY.PROJECTS_HELP
  ),
  new CLICommand(
    VOCABULARY.EXPERIENCE_TRIGGER,
    () => {
      const experience = VOCABULARY.EXPERIENCE.map((item, i) => {
        if (!i) return item;
        const dates = item[1].split("-");
        const startDate = new Date(dates[0]);
        const endDate = dates[1] === "NOW" ? new Date() : new Date(dates[1]);
        return [item[0], useDatesDifference(startDate, endDate), item[2]];
      });
      return useRenderList(experience, "   ");
    },
    VOCABULARY.EXPERIENCE_HELP
  ),
  new CLICommand(
    VOCABULARY.LOCALDATETIME_TRIGGER,
    () => new Date().toLocaleString(),
    VOCABULARY.LOCALDATETIME_HELP
  )
]);

const SYSTEM_COMMANDS = Object.freeze([
  new SystemCLICommand(
    VOCABULARY.SYSTEM_CLEAR_TRIGGER,
    (_, state) => state.cli.length = 0,
    VOCABULARY.SYSTEM_CLEAR_HELP,
    true
  ),
  new SystemCLICommand(
    VOCABULARY.SYSTEM_NOT_FOUND_TRIGGER,
    (command) =>
      VOCABULARY.SYSTEM_NOT_FOUND.replace("$command", command)
  )
]);

export { CLI_COMMANDS, SYSTEM_COMMANDS };
