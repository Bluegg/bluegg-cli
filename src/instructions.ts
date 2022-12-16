import { bold } from "../deps.ts";
import { Command } from "../types.ts";
import { app } from "./constants.ts";

/**
 * A string containing usage instructions for a given command.
 *
 * @param command The current command definition.
 * @returns The string of usage instructions.
 */
export default function instructions(command: Command) {
	const padding = 50;

	let instructions = `\n${bold("Syntax:")} ${app.command} <subcommands> <arguments>`;

	if (command.description) {
		instructions += `\n\n${bold("Description:")} ${command.description}`;
	}

	if (command.subcommands?.length) {
		instructions += `\n\n${bold("Subcommands:")}`;

		command.subcommands.forEach((subcommand) => {
			instructions += `\n${bold(`${subcommand.aliases.join(", ")}`)}`.padEnd(padding);
			instructions += subcommand.description;
		});
	}

	if (command.arguments?.length) {
		instructions += `\n\n${bold("Arguments:")}`;
		command.arguments.forEach((argument) => {
			const userFriendlyArgs: string[] = argument.flags.map((flag) =>
				flag.length !== 1 ? `--${flag}` : `-${flag}`
			);

			instructions += `\n${bold(`${userFriendlyArgs.join(", ")}`)}`.padEnd(padding);
			instructions += argument.description;
		});
	}

	if (command.optionalArguments?.length) {
		instructions += `\n\n${bold("Optional Arguments:")}`;
		command.optionalArguments.forEach((optionalArgument) => {
			const userFriendlyArgs: string[] = optionalArgument.flags.map((flag) =>
				flag.length !== 1 ? `--${flag}` : `-${flag}`
			);

			instructions += `\n${bold(`${userFriendlyArgs.join(", ")}`)}`.padEnd(padding);
			instructions += optionalArgument.description;
		});
	}

	return instructions;
}
