import { Args, bold, italic } from "../../../deps.ts";
import { Command, Environment } from "../../../types.ts";
import destination from "../../arguments/destination.ts";
import options from "../../arguments/options.ts";
import remoteEnvironment from "../../arguments/remoteEnvironment.ts";
import source from "../../arguments/source.ts";
import bootstrap from "../../bootstrap.ts";
import RemoteSync from "../../libraries/filesystem/RemoteSync.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["push", "up", "upload"],
	description: "Upload the directory of local assets to the remote environment.",
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
	bootstrap(command, userEnteredCommand, args);

	const userEnteredEnvironment = remoteEnvironment.value as Environment;
	const userEnteredSource = source.value;
	const userEnteredDestination = destination.value;
	const userEnteredOptions = options.value;

	const confirmed = confirm(
		`Merge the ${bold(italic(userEnteredEnvironment))} assets with the ${
			bold(
				italic("local"),
			)
		} assets?`,
	);
	if (!confirmed) return false;

	const remoteSync = new RemoteSync(
		userEnteredEnvironment,
		userEnteredSource,
		userEnteredDestination,
		userEnteredOptions,
	);

	const _remoteSyncDownload = await remoteSync.upload();
}

export default command;
