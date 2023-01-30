import { bold, italic } from "../deps.ts";
import { app, defaults, env } from "../src/constants.ts";
import InfoMessage from "./libraries/messages/InfoMessage.ts";
import SuccessMessage from "./libraries/messages/SuccessMessage.ts";
import WarningMessage from "./libraries/messages/WarningMessage.ts";

import doesFileExist from "./utilities/doesFileExist.ts";

/**
 * Creates the dotfile using a series of user-entered values.
 *
 * @returns Whether or not the creation of the dotfile was successful.
 */
export default async function createDotfile() {
	const dotfileFilepath = `${Deno.cwd()}/${app.dotfile}`;
	const projectName = env.project.name();

	/* If the dotfile already exists, confirm whether or not it should be overwritten. */
	if (await doesFileExist(dotfileFilepath)) {
		new WarningMessage(`There's already a file named ${bold(app.dotfile)} in this directory.`);

		const confirmed = confirm("Overwrite this file?");
		if (!confirmed) {
			return false;
		}
	} else {
		new InfoMessage(`Creating a new ${bold(app.dotfile)} file in this directory...`);
	}

	const dockerContainer = prompt(
		`Enter the name of the Docker container:`,
		`ddev-${projectName}-web`,
	);

	const stagingServerAddress = prompt(
		`Enter the ${bold(italic("staging"))} server's SSH address:`,
		`staging.${projectName}.com` ?? undefined,
	);

	const stagingServerUsername = prompt(
		`Enter the ${bold(italic("staging"))} server's SSH username:`,
		defaults.defaultServerUsername,
	);

	const stagingSiteDirectory = prompt(
		`Enter the ${bold(italic("staging"))} server's site directory:`,
		defaults.defaultRemoteSiteDirectory,
	);

	const stagingDatabaseName = prompt(
		`Enter the ${bold(italic("staging"))} server's database name:`,
		projectName ? `${projectName}_staging` : undefined,
	);

	const stagingDatabaseUsername = prompt(
		`Enter the ${bold(italic("staging"))} server's database username:`,
		defaults.defaultDatabaseUsername,
	);

	const stagingDatabasePassword = prompt(
		`Enter the ${bold(italic("staging"))} server's database password:`,
	);

	const productionServerAddress = prompt(
		`Enter the ${bold(italic("production"))} server's SSH address:`,
		(stagingServerAddress as string).replace("staging.", ""),
	);

	const productionServerUsername = prompt(
		`Enter the ${bold(italic("production"))} server's SSH username:`,
		stagingServerUsername as string,
	);

	const productionDatabaseName = prompt(
		`Enter the ${bold(italic("production"))} server's database name:`,
		projectName ? `${projectName}_production` : undefined,
	);

	const productionSiteDirectory = prompt(
		`Enter the ${bold(italic("production"))} server's site directory:`,
		defaults.defaultRemoteSiteDirectory,
	);

	const productionDatabaseUsername = prompt(
		`Enter the ${bold(italic("production"))} server's database username:`,
		defaults.defaultDatabaseUsername,
	);

	const productionDatabasePassword = prompt(
		`Enter the ${bold(italic("production"))} server's database password:`,
	);

	/* The lines of content to be added to the dotfile. */
	const dotfileLines = [
		"# The Docker container's name",
		`DOCKER_CONTAINER=${dockerContainer}`,
		"\n# Details and credentials for the project's staging server",
		`STAGING_SERVER_ADDRESS=${stagingServerAddress}`,
		`STAGING_SERVER_USERNAME=${stagingServerUsername}`,
		`STAGING_SITE_DIRECTORY=${stagingSiteDirectory}`,
		`STAGING_DATABASE_NAME=${stagingDatabaseName}`,
		`STAGING_DATABASE_USERNAME=${stagingDatabaseUsername}`,
		`STAGING_DATABASE_PASSWORD=${stagingDatabasePassword}`,
		"\n# Details and credentials for the project's production server",
		`PRODUCTION_SERVER_ADDRESS=${productionServerAddress}`,
		`PRODUCTION_SERVER_USERNAME=${productionServerUsername}`,
		`PRODUCTION_SITE_DIRECTORY=${productionSiteDirectory}`,
		`PRODUCTION_DATABASE_NAME=${productionDatabaseName}`,
		`PRODUCTION_DATABASE_USERNAME=${productionDatabaseUsername}`,
		`PRODUCTION_DATABASE_PASSWORD=${productionDatabasePassword}`,
	];

	/* Inserts a new line at the end of the dotfile. */
	dotfileLines.push("");

	/* Format the array of lines into a string suitable for output to the dotfile. */
	const dotfileContent = dotfileLines.join("\n");

	/* Generates the new dotfile and writes the content. */
	await Deno.writeTextFile(dotfileFilepath, dotfileContent);

	new SuccessMessage(`Created ${bold(app.dotfile)}. Continuing with previous instruction...\n`);

	return true;
}
