import { Args } from "../../../deps.ts";
import { Command } from "../../../types.ts";
import bootstrap from "../../bootstrap.ts";
import pull from "./pull.ts";
import push from "./push.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["assets"],
	description: "Manage local and remote assets for a chosen site.",
	subcommands: [push, pull],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param args The arguments entered by the user.
 */
async function run(args: Args) {
	const userEnteredCommand = args._.shift() as string;
	await bootstrap(command, userEnteredCommand, args);
}

export default command;
