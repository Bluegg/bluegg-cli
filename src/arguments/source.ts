import { Args } from "../../deps.ts";
import { Argument, Command } from "../../types.ts";
import getArgumentValue from "../utilities/getArgumentValue.ts";

/** The argument definition. */
const argument: Argument = {
	run: run,
	description: "Set the source directory for the current operation.",
	flags: ["source", "s"],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 */
function run(_command: Command, args: Args) {
	const source = getArgumentValue(argument, args);
	argument.value = source;

	return source;
}

export default argument;
