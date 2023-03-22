import { bold } from "../deps.ts";
import ErrorMessage from "./libraries/messages/ErrorMessage.ts";

/**
 * Informs users of a missing subcommand.
 */
export function missingSubcommand() {
	new ErrorMessage(
		`Enter a recognised subcommand or argument(s). Use ${bold("--help")} for help.`,
		true
	);
}

/**
 * Informs users of an invalid subcommand.
 *
 * @param subcommand The subcommand entered by the user.
 */
export function invalidSubcommand(subcommand: string) {
	new ErrorMessage(
		`"${subcommand}" is ${bold("--not")} a recognised subcommand. Use ${bold(
			"--help"
		)} for help.`,
		true
	);
}

/**
 * Informs users that there are no possible subcommands available.
 */
export function noPossibleSubcommands() {
	new ErrorMessage(
		`There are no possible subcommands available. Use ${bold("--help")} for help.`,
		true
	);
}

/**
 * Informs users of a missing argument(s).
 */
export function missingArguments() {
	new ErrorMessage(
		`At least one required argument is missing. Use ${bold("--help")} for help.`,
		true
	);
}
