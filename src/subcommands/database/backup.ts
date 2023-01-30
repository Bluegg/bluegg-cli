import { Args } from "../../../deps.ts";
import { Command, Environment } from "../../../types.ts";
import environment from "../../arguments/environment.ts";
import bootstrap from "../../bootstrap.ts";
import LocalDatabase from "../../libraries/database/LocalDatabase.ts";
import RemoteDatabase from "../../libraries/database/RemoteDatabase.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["backup", "export"],
	description: "Create a backup of a database from a given environment.",
	arguments: [environment],
	optionalArguments: [],
};

/**
 * Process the command(s) and/or argument(s) entered by the user.
 *
 * @param args The arguments entered by the user.
 */
async function run(args: Args) {
	const userEnteredCommand = args._.shift() as string;
	bootstrap(command, userEnteredCommand, args);

	const userEnteredEnvironment = environment.value as Environment;

	if (userEnteredEnvironment === "dev") {
		const localDatabase = new LocalDatabase();
		const _localDatabaseExport = await localDatabase.export();
	} else {
		const remoteDatabase = new RemoteDatabase(userEnteredEnvironment);
		const _remoteDatabaseExport = await remoteDatabase.export();
	}
}

export default command;
