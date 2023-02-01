import { Args, bold, italic } from "../../../deps.ts";
import { Command, Environment } from "../../../types.ts";
import destination from "../../arguments/destination.ts";
import options from "../../arguments/options.ts";
import remoteEnvironment from "../../arguments/remoteEnvironment.ts";
import source from "../../arguments/source.ts";
import bootstrap from "../../bootstrap.ts";
import RemoteSync from "../../libraries/filesystem/RemoteSync.ts";
import getArgumentValue from "../../utilities/getArgumentValue.ts";

/** The command definition. */
const command: Command = {
	run: run,
	aliases: ["pull", "down", "download"],
	description: "Download the directory of remote assets to the local environment.",
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
		`Merge the ${bold(italic("local"))} assets with the ${
			bold(
				italic(userEnteredEnvironment),
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

	const _remoteSyncDownload = await remoteSync.download();
}

export default command;
