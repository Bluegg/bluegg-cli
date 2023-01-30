import { Args } from "./deps.ts";

export type Environment = "dev" | "staging" | "production";

export type Command = {
	/** The command's callable function. */
	run: (args: Args) => void;
	/** A list of the command's aliases. */
	aliases: string[];
	/** A brief description of the command's purpose. */
	description: string;
	/** A list of the command's subcommands. */
	subcommands?: Command[];
	/** A list of the command's arguments. */
	arguments?: Argument[];
	/** A list of the command's optional arguments. */
	optionalArguments?: Argument[];
};

export type Argument = {
	/** The argument's callable function. */
	run: (command: Command, args: Args) => void;
	/** A brief description of the argument's purpose. */
	description: string;
	/** A list of accepted flags for the argument. */
	flags: string[];
	/** The value of the argument as entered by the user. */
	value?: string;
};
