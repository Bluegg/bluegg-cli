import { bold } from "../../deps.ts";
import ErrorMessage from "../libraries/messages/ErrorMessage.ts";
import WarningMessage from "../libraries/messages/WarningMessage.ts";
import doesFileExist from "./doesFileExist.ts";

/**
 * Determines the existence of files required by the application.
 *
 * @returns The determination as described (*true or false*).
 */
export default async function doRequiredFilesExist() {
	const requiredFiles = [".env"];
	let trigger = null;

	for (const requiredFile of requiredFiles) {
		if ((await doesFileExist(`${Deno.cwd()}/${requiredFile}`)) === false) {
			trigger = new WarningMessage(
				`There's no ${bold(requiredFile)} file in this directory.`,
			);
		}
	}

	if (trigger !== null) {
		new ErrorMessage(
			"One or more required files are missing. Are you in the correct directory?",
			true,
		);
		return false;
	}

	return true;
}
