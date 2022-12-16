import { bold, yellow } from "../../../deps.ts";

export default class WarningMessage {
	private message: string | undefined;
	private exit: boolean | undefined;

	/**
	 * Displays a warning message in the console.
	 *
	 * @param message The message to be displayed to the user.
	 * @param exit Whether or not the application should exit after displaying the message.
	 */
	constructor(message: string | undefined, exit?: boolean | undefined) {
		this.message = message;
		this.exit = exit;

		if (this.message) console.warn(bold(yellow("Warning:")), this.message);
		if (this.exit) Deno.exit();
	}
}
