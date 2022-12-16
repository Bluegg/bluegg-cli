import { bold, cyan } from "../../../deps.ts";

export default class InfoMessage {
	private message: string | undefined;
	private exit: boolean | undefined;

	/**
	 * Displays an informative message in the console.
	 *
	 * @param message The message to be displayed to the user.
	 * @param exit Whether or not the application should exit after displaying the message.
	 */
	constructor(message: string | undefined, exit?: boolean | undefined) {
		this.message = message;
		this.exit = exit;

		if (this.message) console.info(bold(cyan("Info:")), this.message);
		if (this.exit) Deno.exit();
	}
}
