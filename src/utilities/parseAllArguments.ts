import { Args } from "../../deps.ts";
import { Command } from "../../types.ts";

/**
 * Determines if a given command's arguments have all been provided by the user.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 * @returns The determination as described (*true or false*).
 */
export default function parseAllArguments(command: Command, args: Args) {
	if (!command.arguments) return undefined;

	return command.arguments.filter((argument) => {
		const isAThing = argument.flags.some((key) => Object.keys(args).includes(key));

		if (isAThing) return argument;
	});
}
