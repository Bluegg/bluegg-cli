import { Args, bold, gray, italic } from "../../../deps.ts";
import { Command, Environment } from "../../../types.ts";
import environment from "../../arguments/environment.ts";
import remoteEnvironment from "../../arguments/remoteEnvironment.ts";
import bootstrap from "../../bootstrap.ts";
import LocalDatabase from "../../libraries/database/LocalDatabase.ts";
import RemoteDatabase from "../../libraries/database/RemoteDatabase.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["push", "up"],
	description: "Push a local database to a remote database server.",
	arguments: [remoteEnvironment],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param args The arguments entered by the user.
 */
async function run(args: Args) {
	const userEnteredCommand = args._.shift() as string;
	bootstrap(command, userEnteredCommand, args);

	const userEnteredEnvironment = remoteEnvironment.value as Environment;

	const confirmed = confirm(
		`Overwrite the ${bold(italic(userEnteredEnvironment))} database with the ${
			bold(
				italic("local"),
			)
		} database? ${gray("Both databases will also be backed-up locally.")}`,
	);
	if (!confirmed) return false;

	const remoteDatabase = new RemoteDatabase(userEnteredEnvironment);
	const localDatabase = new LocalDatabase();

	const _remoteDatabaseExport = await remoteDatabase.export();
	const localDatabaseExport = await localDatabase.export();

	await remoteDatabase.import(localDatabaseExport);
}

export default command;
