import { bold } from "../../deps.ts";
import { app } from "../constants.ts";
import { createDotfile, renameDotfile } from "../dotfile.ts";
import WarningMessage from "../libraries/messages/WarningMessage.ts";
import doesFileExist from "./doesFileExist.ts";

/**
 * Determines the existence of the application's dotfile and prompts the user to create one.
 *
 * @returns The determination as described (*true or false*).
 */
export default async function doesDotfileExist() {
	if ((await doesFileExist(`${Deno.cwd()}/${app.oldDotfile}`)) !== false) {
		new WarningMessage(`There is an old ${app.oldDotfile} file in this directory.`);

		const confirmed = confirm(`Rename to ${app.dotfile}? (Recommended)`);
		if (confirmed) return await renameDotfile();
	}

	if ((await doesFileExist(`${Deno.cwd()}/${app.dotfile}`)) === false) {
		new WarningMessage(`There's no ${bold(app.dotfile)} file in this directory.`);

		const confirmed = confirm("Create one now? (Recommended)");
		if (confirmed) return await createDotfile();
	}

	return false;
}
