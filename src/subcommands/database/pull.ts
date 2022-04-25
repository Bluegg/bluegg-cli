/*
	Database: Pull
	The application's `database pull` subcommand
*/

/* Imports */
import { Args, bold } from "../../../deps.ts";
import { Environment, remoteEnvironments } from "../../../types.ts";
import { invalidSubcommand } from "../../../src/constants.ts";
import { error } from "../../../src/libraries/messages.ts";
import {
	exportLocalDatabase,
	exportRemoteDatabase,
	importLocalDatabase,
} from "../../../src/libraries/mysql.ts";

/* Constants */
export const meta = {
	subcommands: ["pull"],
	description: "Pull a remote database to a local database server.",
};

/* The subcommand's instructions */
const instructions = `
${bold("Description:")} ${meta.description}

${bold("Arguments:")}
${bold("-e, --env")}	Which environment to pull the database from. <${
	remoteEnvironments.join(" | ")
}>
${bold("-h, --help")}	Displays usage examples and supported syntax.`;

/* Logic for the subcommand's `--help` argument */
const help = (): void => {
	console.info(instructions);
	Deno.exit();
};

/* Logic for the subcommand's `--env` argument */
const environment = (args: Args): Environment => {
	const environment: Environment = args.e ?? args.env;

	if (environment !== "staging" && environment !== "production") {
		error(`"${environment}" is not a valid environment in this context.`, true);
	}

	return environment;
};

/* Logic for the subcommand */
export const pull = async (args: Args): Promise<void> => {
	/* Get any additional subcommands entered by the user */
	const subcommand = args._.shift() as string;

	/* Process the subcommands or arguments entered by the user */
	if (subcommand) {
		error(invalidSubcommand(subcommand));
	} else {
		if (args.h || args.help) help();

		if (typeof args.e !== "string" && typeof args.env !== "string") {
			error("No environment has been entered.", true);
		}

		const remoteDatabaseExport = await exportRemoteDatabase(environment(args));
		const _localDatabaseExport = await exportLocalDatabase();

		await importLocalDatabase(remoteDatabaseExport);

		Deno.exit();
	}
};
