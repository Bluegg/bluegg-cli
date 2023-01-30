import { Args, gray } from "../../deps.ts";
import { Argument, Command } from "../../types.ts";
import getArgumentValue from "../utilities/getArgumentValue.ts";

/** The argument definition. */
const argument: Argument = {
	run: run,
	description:
		"Options to pass to the shell in which the command is being executed. Value should be wrapped in quotes.",
	flags: ["options"],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 */
function run(_command: Command, args: Args) {
	const options = getArgumentValue(argument, args).toString();
	argument.value = options;

	console.log(gray(`Passing the following options to the shell: ${options}`));

	return options;
}

export default argument;
