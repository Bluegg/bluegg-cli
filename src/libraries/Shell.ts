import { writeAll } from "../../deps.ts";
import ErrorMessage from "./messages/ErrorMessage.ts";

export default class Shell {
	private command: string;
	private input: string | undefined;
	private output: string | undefined;

	/**
	 * Sets up a shell that allows for the execution of commands.
	 *
	 * @param command The command to be executed.
	 * @param input The filepath of the command's input.
	 * @param output The filepath of the command's output.
	 */
	constructor(command: string, input?: string | undefined, output?: string | undefined) {
		this.command = command;
		this.input = input;
		this.output = output;

		if (!command) new ErrorMessage("No command has been entered.", true);
	}

	/**
	 * Executes the given command in the current shell.
	 *
	 * @param command The command to be executed.
	 * @returns The Deno process's status.
	 */
	private async execute(command: string) {
		/* Regular expression to find spaces in a string *unless* the string is wrapped inside quotes. */
		const expression = / +(?=(?:(?:[^"]*"){2})*[^"]*$)/g;

		/* The Deno subprocess. */
		const subprocess = Deno.run({
			cmd: command.split(expression),
			stdin: "piped",
			stdout: "piped",
			stderr: "piped",
		});

		/* If any input is provided, pass it to the subprocess. */
		if (this.input) {
			await writeAll(subprocess.stdin, await Deno.readFile(this.input as string));
			subprocess.stdin.close();
		}

		/* Await and store the command's status, output, and error output. */
		const [processStatus, standardOutput, standardError] = await Promise.all([
			subprocess.status(),
			subprocess.output(),
			subprocess.stderrOutput(),
		]);

		/* Decode the command's output and error output as text strings. */
		const standardOutputValue = new TextDecoder().decode(standardOutput);
		const standardErrorValue = new TextDecoder().decode(standardError);

		/* If an error is returned, display the error output and exit. */
		if (standardErrorValue) new ErrorMessage(standardErrorValue, true);

		/* If any output is returned, display the output or write it to the file specified. */
		if (this.output && standardOutputValue) {
			await Deno.writeTextFile(this.output, standardOutputValue);
		} else if (standardOutputValue) console.log(standardOutputValue);

		return processStatus;
	}

	/**
	 * Executes the given command within the user's local shell.
	 *
	 * @returns The Deno process's status.
	 */
	public async executeInLocal() {
		return await this.execute(this.command);
	}

	/**
	 * Executes the given command within the Docker container's shell.
	 *
	 * @param container The name of the Docker container in which the command should be executed on.
	 * @returns The Deno process's status.
	 */
	public async executeInDocker(container: string) {
		return await this.execute(`docker exec -i ${container} ${this.command}`);
	}

	/**
	 * Executes the given command on the remote server.
	 *
	 * @param username The SSH username of the remote server.
	 * @param address The SSH address of the remote server.
	 * @returns The Deno process's status.
	 */
	public async executeOnRemote(username: string, address: string) {
		return await this.execute(`ssh ${username}@${address} ${this.command}`);
	}
}
