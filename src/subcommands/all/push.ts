import { Args, bold, italic } from "../../../deps.ts";
import { Command, Environment } from "../../../types.ts";
import destination from "../../arguments/destination.ts";
import options from "../../arguments/options.ts";
import remoteEnvironment from "../../arguments/remoteEnvironment.ts";
import source from "../../arguments/source.ts";
import bootstrap from "../../bootstrap.ts";
import RemoteSync from "../../libraries/filesystem/RemoteSync.ts";
import LocalDatabase from "../../libraries/database/LocalDatabase.ts";
import RemoteDatabase from "../../libraries/database/RemoteDatabase.ts";
import getArgumentValue from "../../utilities/getArgumentValue.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["push", "up", "upload"],
	description:
		"Upload the directory of local assets to the remote environment and push a local database to a remote database server.",
	arguments: [remoteEnvironment],
	optionalArguments: [source, destination, options],
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
	const userEnteredSource = getArgumentValue(source, args);
	const userEnteredDestination = getArgumentValue(destination, args);
	const userEnteredOptions = getArgumentValue(options, args);

	const confirmed = confirm(
		`DB Push & Assets Push: Running this overwrite the ${
			bold(
				italic(userEnteredEnvironment),
			)
		} database with the ${bold(italic("local"))} database and merge the ${
			bold(
				italic("local"),
			)
		} assets with the ${bold(italic(userEnteredEnvironment))} assets. Enter ${
			bold(
				italic("y"),
			)
		} to confirm.`,
	);

	if (!confirmed) return false;

	const remoteDatabase = new RemoteDatabase(userEnteredEnvironment, userEnteredOptions);
	const localDatabase = new LocalDatabase(userEnteredOptions);

	const _remoteDatabaseExport = await remoteDatabase.export();
	const localDatabaseExport = await localDatabase.export();

	await remoteDatabase.import(localDatabaseExport);

	const remoteSync = new RemoteSync(
		userEnteredEnvironment,
		userEnteredSource,
		userEnteredDestination,
		userEnteredOptions,
	);

	const _remoteSyncDownload = await remoteSync.upload();
}

export default command;
