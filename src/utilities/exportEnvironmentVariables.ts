import { config } from "../../deps.ts";

/**
 * Exports the environment variables from a given file for use throughout the application.
 *
 * @param filepath The filepath of the the file containing the environment variables.
 * @returns Whether or not the process was successful.
 */
export async function exportEnvironmentVariables(filepath: string) {
	await config({ path: filepath, export: true });

	return true;
}
