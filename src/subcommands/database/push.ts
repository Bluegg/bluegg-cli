/*
	Database: Push
	The application's `database push` subcommand
*/

/* Imports */
import { Args, bold } from "../../../deps.ts";
import { Environment, remoteEnvironments } from "../../../types.ts";
import { invalidSubcommand } from "../../../src/constants.ts";
import { error } from "../../../src/libraries/messages.ts";
import {
	exportLocalDatabase,
	exportRemoteDatabase,
	importRemoteDatabase,
} from "../../../src/libraries/mysql.ts";

/* Constants */
export const meta = {
	subcommands: ["push"],
	description: "Push a local database to a remote database server.",
};

/* The subcommand's instructions */
const instructions = `
${bold("Description:")} ${meta.description}

${bold("Arguments:")}
${bold("-e, --env")}	Which environment to push the database to. <${
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
	const environment: string = args.e ?? args.env;

	if (!remoteEnvironments.includes(environment)) {
		error(`"${environment}" is not a valid environment in this context.`, true);
	}

	return environment as Environment;
};

/* Logic for the subcommand */
export const push = async (args: Args): Promise<void> => {
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

		const localDatabaseExport = await exportLocalDatabase();
		const _remoteDatabaseExport = await exportRemoteDatabase(environment(args));

		await importRemoteDatabase(environment(args), localDatabaseExport);

		Deno.exit();
	}
};
