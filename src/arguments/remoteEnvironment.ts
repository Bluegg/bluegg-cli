import { Args } from "../../deps.ts";
import { Argument, Command, Environment } from "../../types.ts";
import { remoteEnvironments } from "../constants.ts";
import ErrorMessage from "../libraries/messages/ErrorMessage.ts";
import getArgumentValue from "../utilities/getArgumentValue.ts";

/** The argument definition. */
const argument: Argument = {
	run: run,
	description: `Which environment to perform the action on. <${remoteEnvironments.join(" | ")}>`,
	flags: ["environment", "env", "e"],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 */
function run(_command: Command, args: Args): Environment {
	const environment = getArgumentValue(argument, args) as Environment;

	if (typeof environment !== "string") {
		new ErrorMessage("No environment has been entered.", true);
	}

	if (!remoteEnvironments.includes(environment)) {
		new ErrorMessage(`"${environment}" is not a valid environment in this context.`, true);
	}

	return environment;
}

export default argument;
