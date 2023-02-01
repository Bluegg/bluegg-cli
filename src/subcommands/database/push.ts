import { Args, bold, gray, italic } from "../../../deps.ts";
import { Command, Environment } from "../../../types.ts";
import options from "../../arguments/options.ts";
import remoteEnvironment from "../../arguments/remoteEnvironment.ts";
import bootstrap from "../../bootstrap.ts";
import LocalDatabase from "../../libraries/database/LocalDatabase.ts";
import RemoteDatabase from "../../libraries/database/RemoteDatabase.ts";
import getArgumentValue from "../../utilities/getArgumentValue.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["push", "up"],
	description: "Push a local database to a remote database server.",
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
	await bootstrap(command, userEnteredCommand, args);

	const userEnteredEnvironment = getArgumentValue(remoteEnvironment, args) as Environment;
	const userEnteredOptions = getArgumentValue(options, args);

	const confirmed = confirm(
		`Overwrite the ${bold(italic(userEnteredEnvironment))} database with the ${
			bold(
				italic("local"),
			)
		} database? ${gray("Both databases will also be backed-up locally.")}`,
	);
	if (!confirmed) return false;

	const remoteDatabase = new RemoteDatabase(userEnteredEnvironment, userEnteredOptions);
	const localDatabase = new LocalDatabase(userEnteredOptions);

	const _remoteDatabaseExport = await remoteDatabase.export();
	const localDatabaseExport = await localDatabase.export();

	await remoteDatabase.import(localDatabaseExport);
}

export default command;
