import { Args } from "../../deps.ts";
import { Argument, Command } from "../../types.ts";
import instructions from "../instructions.ts";

/** The argument definition. */
const argument: Argument = {
	run: run,
	description: "Displays usage examples and supported syntax.",
	flags: ["help", "h"],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 */
function run(command: Command, _args: Args) {
	console.info(instructions(command));
	Deno.exit();
}

export default argument;
