import { Args, bold, gray, italic } from "../../../deps.ts";
import { Command, Environment } from "../../../types.ts";
import options from "../../arguments/options.ts";
import remoteEnvironment from "../../arguments/remoteEnvironment.ts";
import bootstrap from "../../bootstrap.ts";
import LocalDatabase from "../../libraries/database/LocalDatabase.ts";
import RemoteDatabase from "../../libraries/database/RemoteDatabase.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["pull", "down"],
	description: "Pull a remote database to a local database server.",
	arguments: [remoteEnvironment],
	optionalArguments: [options],
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
	const userEnteredOptions = options.value;

	const confirmed = confirm(
		`Overwrite the ${bold(italic("local"))} database with the ${
			bold(
				italic(userEnteredEnvironment),
			)
		} database? ${gray("Both databases will also be backed-up locally.")}`,
	);
	if (!confirmed) return false;

	const remoteDatabase = new RemoteDatabase(userEnteredEnvironment, userEnteredOptions);
	const localDatabase = new LocalDatabase(userEnteredOptions);

	const remoteDatabaseExport = await remoteDatabase.export();
	const _localDatabaseExport = await localDatabase.export();

	await localDatabase.import(remoteDatabaseExport);
}

export default command;
