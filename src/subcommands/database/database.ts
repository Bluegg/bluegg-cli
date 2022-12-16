import { Args } from "../../../deps.ts";
import { Command } from "../../../types.ts";
import bootstrap from "../../bootstrap.ts";
import backup from "./backup.ts";
import pull from "./pull.ts";
import push from "./push.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["database", "db"],
	description: "Manage local and remote databases for a chosen site.",
	subcommands: [push, pull, backup],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param args The arguments entered by the user.
 */
function run(args: Args) {
	const userEnteredCommand = args._.shift() as string;
	bootstrap(command, userEnteredCommand, args);
}

export default command;
