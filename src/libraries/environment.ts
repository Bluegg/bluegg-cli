/*
	Environment
	Helper functions for logic related to the project environment
*/

/* Imports */
import { bold, config } from "../../deps.ts";
import { error } from "../libraries/messages.ts";

/* Update and rewrite a collection of environment variables to a given file */
export const rewriteEnvironmentVariables = async (
	filepath: string,
	variables: { [key: string]: unknown },
) => {
	/* Reads the contents of the given file */
	const environmentVariables = await Deno.readTextFile(filepath);

	/* Split the contents of the file by line break into an array */
	const environmentVariablesArray = environmentVariables.split("\n");

	/* Loop through each of the environment variables that need updating */
	Object.entries(variables).forEach(([key, value]) => {
		/* Find the corresponding environment variable from the split array */
		const line = environmentVariablesArray.indexOf(
			environmentVariablesArray.find((variable) => variable.match(key)) as string,
		);

		/* Update the environment variable ONLY if it already exists, otherwise throw an error */
		if (line !== -1) environmentVariablesArray.splice(line, 1, `${key}=${value}`);
		else error(`${bold(key)} was not found in ${bold(filepath)}. `, true);
	});

	/* Write all environment variables, including the updated ones, back to the file */
	await Deno.writeTextFile(filepath, environmentVariablesArray.join("\n"));

	/* Exports the variables for use throughout the application */
	await exportEnvironmentVariablesFromFile(filepath);

	return true;
};

/* Export the environment variables from a given file for use throughout the application */
export const exportEnvironmentVariablesFromFile = async (filepath: string): Promise<boolean> => {
	await config({ path: filepath, export: true });

	return true;
};
