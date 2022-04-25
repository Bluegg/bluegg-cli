/*
	Shell
	Helper functions for shell-based functionality
*/

/* Imports */
import { writeAll } from "../../deps.ts";
import { env } from "../../src/constants.ts";
import { validator } from "../helpers.ts";
import { error } from "./messages.ts";

/* Executes a command in the local shell */
export const execute = async (
	command: string,
	input?: string | null,
	output?: string | null,
): Promise<Deno.ProcessStatus> => {
	if (!command) error("No command has been entered.", true);

	/* Regular expression to find spaces in a string *unless* the string is wrapped inside quotes */
	const expression = / +(?=(?:(?:[^"]*"){2})*[^"]*$)/g;

	/* The Deno subprocess */
	const subprocess = Deno.run({
		cmd: command.split(expression),
		stdin: "piped",
		stdout: "piped",
		stderr: "piped",
	});

	/* If any input is provided, pass it to the subprocess */
	if (input) {
		await writeAll(subprocess.stdin, await Deno.readFile(input as string));
		subprocess.stdin.close();
	}

	/* Await and store the command's status, output, and error output */
	const [processStatus, standardOutput, standardError] = await Promise.all([
		subprocess.status(),
		subprocess.output(),
		subprocess.stderrOutput(),
	]);

	/* Decode the command's output and error output as text strings */
	const standardOutputValue = new TextDecoder().decode(standardOutput);
	const standardErrorValue = new TextDecoder().decode(standardError);

	/* If an error is returned, display the error output and exit */
	if (standardErrorValue) error(standardErrorValue, true);

	/* If any output is returned, display the output or write it to the file specified */
	if (output && standardOutputValue) await Deno.writeTextFile(output, standardOutputValue);
	else if (standardOutputValue) console.log(standardOutputValue);

	return processStatus;
};

/* Executes a command on the specified Docker container */
export const dockerExecute = async (
	command: string,
	input?: string | null,
	output?: string | null,
): Promise<Deno.ProcessStatus> => {
	if (!command) error("No command has been entered.", true);

	/* Get any variables required by the command */
	const container = validator("Docker container", env.docker.container);

	/* Execute the command and return its status */
	return await execute(`docker exec -i ${container} ${command}`, input, output);
};

/* Executes a command on the specified remote server */
export const remoteExecute = async (
	command: string,
	username: string,
	server: string,
	input?: string | null,
	output?: string | null,
): Promise<Deno.ProcessStatus> => {
	if (!command) error("No command has been entered.", true);

	/* Execute the command and return its status */
	return await execute(`ssh ${username}@${server} ${command}`, input, output);
};
