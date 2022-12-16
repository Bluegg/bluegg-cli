import { Args } from "../../deps.ts";
import { Command } from "../../types.ts";
import getArgument from "./getArgument.ts";

/**
 * Determines if a given command's arguments have all been provided by the user.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 * @returns The determination as described (*true or false*).
 */
export default function areAllArgumentsProvided(command: Command, args: Args) {
	if (!command.arguments) return true;

	return command.arguments.every((argument) => {
		const validArgument = getArgument([argument], args);
		if (validArgument) return true;
		else return false;
	});
}
