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
		const processArgs = command.split(expression);
		const processExc = processArgs.shift() as string;
		const processCommand = new Deno.Command(processExc, {
			args: processArgs,
			stdin: "piped",
			stdout: "piped",
			stderr: "piped",
		});

		const subprocess = processCommand.spawn();

		if (this.input) {
			const writer = subprocess.stdin.getWriter();
			const file = await Deno.readFile(this.input as string);

			writer.ready
				.then(() => {
					writer.write(file);
				})
				.catch((err) => {
					console.log("Chunk error:", err);
				});

			writer.ready
				.then(() => {
					writer.close();
				})
				.catch((err) => {
					console.log("Stream error:", err);
					return false;
				});
		} else {
			subprocess.stdin.close();
		}

		const { success, stdout, stderr } = await subprocess.output();

		/* Decode the command's output and error output as text strings. */
		const standardOutputValue = new TextDecoder().decode(stdout);
		const standardErrorValue = new TextDecoder().decode(stderr);

		/* If any output is returned, display the output or write it to the file specified. */
		if (this.output && standardOutputValue) {
			await Deno.writeTextFile(this.output, standardOutputValue);
		} else if (standardOutputValue) console.log(standardOutputValue);

		/* If an error is returned, display the error output and exit. */
		if (standardErrorValue) new ErrorMessage(standardErrorValue, true);

		return success;
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
