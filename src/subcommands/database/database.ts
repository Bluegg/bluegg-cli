/*
	Database
	The application's `database` subcommand
*/

/* Imports */
import { Args, bold } from "../../../deps.ts";
import { additionalSubcommandRequired, invalidSubcommand } from "../../../src/constants.ts";
import { error } from "../../../src/libraries/messages.ts";
import { meta as pushMeta, push } from "./push.ts";
import { meta as pullMeta, pull } from "./pull.ts";

/* Constants */
export const meta = {
	subcommands: ["database", "db"],
	description: "Manage local and remote databases for a chosen site.",
};

/* The subcommand's instructions */
const instructions = `
${bold("Description:")} ${meta.description}

${bold("Subcommands:")}
${bold(`${pushMeta.subcommands.join(", ")}`)}	${pushMeta.description}
${bold(`${pullMeta.subcommands.join(", ")}`)}	${pullMeta.description}

${bold("Arguments:")}
${bold("-h, --help")}	Displays usage examples and supported syntax.`;

/* Logic for the subcommand's `--help` argument */
const help = (): void => {
	console.info(instructions);
	Deno.exit();
};

/* Logic for the subcommand */
export const database = (args: Args): void => {
	/* Get any additional subcommands entered by the user */
	const subcommand = args._.shift() as string;

	/* Process the subcommands or arguments entered by the user */
	if (subcommand) {
		if (subcommand === "push") push(args);
		else if (subcommand === "pull") pull(args);
		else error(invalidSubcommand(subcommand));
	} else {
		if (args.h || args.help) help();
		else error(additionalSubcommandRequired());
		Deno.exit();
	}
};
