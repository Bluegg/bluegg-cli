import { Args } from "./../deps.ts";
import { Command } from "./../types.ts";
import help from "./arguments/help.ts";
import {
	invalidSubcommand,
	missingArguments,
	missingSubcommand,
	noPossibleSubcommands,
} from "./messages.ts";
import areAllArgumentsProvided from "./utilities/areAllArgumentsProvided.ts";
import getArgument from "./utilities/getArgument.ts";
import getSubcommand from "./utilities/getSubcommand.ts";

/**
 * The bootstrapper to validate the user's complete command-line input.
 *
 * @param command The current command definition.
 * @param args The arguments entered by the user.
 */

export default function bootstrap(command: Command, userEnteredCommand: string, args: Args) {
	/** Immediately determine if the user has entered an argument for help. */
	const userNeedsHelp = getArgument([help], args);

	/** To be called when the user has requested help. */
	const helpUser = () => (userNeedsHelp ? userNeedsHelp.run(command, args) : false);

	/** Check if the user has entered any valid optional arguments. */
	const validOptionalArguments = command.optionalArguments &&
		getArgument(command.optionalArguments, args);

	/** Run the callable functions of any valid optional arguments. */
	const runValidOptionalArguments = () => {
		if (command.optionalArguments) {
			/* Navigate through the list of optional arguments in order to determine if the user has
            entered any of the arguments in no specific order. */
			command.optionalArguments.filter((argument) => {
				/* Determine if any of the optional arguments have been provided by the user. */
				const argumentProvided = argument.flags.some((key) =>
					Object.keys(args).includes(key)
				);

				/* If the user-entered argument is valid, run its callable function, otherwise inform
                the user that it's invalid. */
				const validArgument = getArgument([argument], args);
				if (validArgument) validArgument.run(command, args);

				if (argumentProvided) return true;
			});
		}
	};

	/** Validate and run the callable functions of any required arguments. */
	const runValidRequiredArguments = () => {
		if (command.arguments) {
			/* Navigate through the list of required arguments in order to determine if the user has
            entered any of the arguments in no specific order. */
			command.arguments.filter((argument) => {
				/* Determine if any of the required arguments have been provided by the user. */
				const argumentProvided = argument.flags.some((key) =>
					Object.keys(args).includes(key)
				);

				/* If the user-entered argument is valid, run its callable function, otherwise inform
                the user that it's invalid. */
				const validArgument = getArgument([argument], args);
				if (validArgument) validArgument.run(command, args);

				if (argumentProvided) return true;

				/* Inform the user if any of the required arguments are missing. */
				if (!areAllArgumentsProvided(command, args)) missingArguments();
			});
		}
	};

	/* Inform the user if the current command is expecting a subcommand that hasn't been entered. */
	if (command.subcommands && !userEnteredCommand && !userNeedsHelp && !validOptionalArguments) {
		missingSubcommand();
	}

	/* Inform the user if the current command has no possible subcommands available. */
	if (!command.subcommands && userEnteredCommand && !userNeedsHelp && !validOptionalArguments) {
		noPossibleSubcommands();
	}

	if (command.subcommands) {
		/* Ensure that the user-entered subcommand is valid. */
		const validCommand = getSubcommand(command.subcommands, userEnteredCommand);

		/* If the user-entered command is valid, run its callable function, otherwise inform the
        user that it's invalid. However, if the user has requested help, display the usage
        instructions instead of throwing an error. */
		if (validCommand) validCommand.run(args);
		else if (userNeedsHelp) helpUser();
		else if (validOptionalArguments) runValidOptionalArguments();
		else invalidSubcommand(userEnteredCommand);

		/* At the end of each check for the existence of subcommands, mark the validation as
        successful in order to allow the application to validate the next subcommand(s). */
		return true;
	}

	/* If the user has requested help at any point within the argument entry process,
    display the usage instructions instead of throwing an error. Checking for the help
    request at this point in the validation process ensures that it will ignore any
    validation errors within the argument's own callable function. */
	if (userNeedsHelp) helpUser();

	runValidRequiredArguments();
	if (validOptionalArguments) runValidOptionalArguments();

	return true;
}
