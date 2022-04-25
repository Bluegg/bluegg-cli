/*
	Dotfile
	Logic related to the applications's dotfile stored in the user's current working directory
*/

/* Imports */
import { bold, italic } from "../deps.ts";
import { app, env } from "../src/constants.ts";
import { info, warning } from "./libraries/messages.ts";
import { fileExists } from "./libraries/filesystem.ts";
import { exportEnvironmentVariablesFromFile } from "./libraries/environment.ts";

/* Get the dotfile filepath from the user's current working directory */
export const dotfileFilepath = () => `${Deno.cwd()}/${app.dotfile}`;

/* Create the dotfile using a series of user-entered values */
export const createDotfile = async (): Promise<boolean> => {
	const projectName = env.project.name();

	/* If the dotfile already exists, confirm whether or not it should be overwritten */
	if (await fileExists(dotfileFilepath())) {
		warning(`There's already a file named ${bold(app.dotfile)} in this directory.`);

		const confirmed = confirm("Overwrite this file?");
		if (!confirmed) return false;
	} else info(`Creating a new ${bold(app.dotfile)} file in this directory...`);

	const dockerContainer = prompt(
		`Enter the name of the Docker container:`,
		`ddev-${projectName}-web`,
	);

	const productionServerAddress = prompt(
		`Enter the ${bold(italic("production"))} server's SSH address:`,
		`${projectName}.com` ?? undefined,
	);

	const productionServerUsername = prompt(
		`Enter the ${bold(italic("production"))} server's SSH username:`,
		env.defaults.serverUsername,
	);

	const productionDatabaseName = prompt(
		`Enter the ${bold(italic("production"))} server's database name:`,
		projectName ? `${projectName}_production` : undefined,
	);

	const productionDatabaseUsername = prompt(
		`Enter the ${bold(italic("production"))} server's database username:`,
		env.defaults.databaseUsername,
	);

	const productionDatabasePassword = prompt(
		`Enter the ${bold(italic("production"))} server's database password:`,
	);

	const stagingServerAddress = prompt(
		`Enter the ${bold(italic("staging"))} server's SSH address:`,
		`staging.${projectName}.com` ?? undefined,
	);

	const stagingServerUsername = prompt(
		`Enter the ${bold(italic("staging"))} server's SSH username:`,
		productionServerUsername as string,
	);

	const stagingDatabaseName = prompt(
		`Enter the ${bold(italic("staging"))} server's database name:`,
		projectName ? `${projectName}_staging` : undefined,
	);

	const stagingDatabaseUsername = prompt(
		`Enter the ${bold(italic("staging"))} server's database username:`,
		env.defaults.databaseUsername,
	);

	const stagingDatabasePassword = prompt(
		`Enter the ${bold(italic("staging"))} server's database password:`,
	);

	/* The lines of content to be added to the dotfile */
	const dotfileLines = [
		"# The Docker container's name",
		`DOCKER_CONTAINER=${dockerContainer}`,
		"\n# Details and credentials for the project's production server",
		`PRODUCTION_SERVER_ADDRESS=${productionServerAddress}`,
		`PRODUCTION_SERVER_USERNAME=${productionServerUsername}`,
		`PRODUCTION_DATABASE_NAME=${productionDatabaseName}`,
		`PRODUCTION_DATABASE_USERNAME=${productionDatabaseUsername}`,
		`PRODUCTION_DATABASE_PASSWORD=${productionDatabasePassword}`,
		"\n# Details and credentials for the project's staging server",
		`STAGING_SERVER_ADDRESS=${stagingServerAddress}`,
		`STAGING_SERVER_USERNAME=${stagingServerUsername}`,
		`STAGING_DATABASE_NAME=${stagingDatabaseName}`,
		`STAGING_DATABASE_USERNAME=${stagingDatabaseUsername}`,
		`STAGING_DATABASE_PASSWORD=${stagingDatabasePassword}`,
	];

	/* Inserts a new line at the end of the dotfile */
	dotfileLines.push("");

	/* Format the array of lines into a string suitable for output to the dotfile */
	const dotfileContent = dotfileLines.join("\n");

	/* Generates the new dotfile and writes the content */
	await Deno.writeTextFile(dotfileFilepath(), dotfileContent);

	/* Exports the variables for use throughout the application */
	await exportEnvironmentVariablesFromFile(dotfileFilepath());

	return true;
};
