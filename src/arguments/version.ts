import { Args } from "../../deps.ts";
import { Command } from "../../types.ts";
import { app } from "../constants.ts";

/** The argument definition. */
const argument = {
	run: run,
	description: "Displays the installed version of the application",
	flags: ["version", "v"],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 */
function run(_command: Command, _args: Args) {
	console.info(app.name, app.version);
	Deno.exit();
}

export default argument;
