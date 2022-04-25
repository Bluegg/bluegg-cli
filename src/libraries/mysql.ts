/*
	MySQL
	Helper functions for logic related to the management of MySQL database servers
*/

/* Imports */
import { Environment } from "../../types.ts";
import { env } from "../../src/constants.ts";
import { validator } from "../helpers.ts";
import { error, success } from "../libraries/messages.ts";
import { dockerExecute, remoteExecute } from "../libraries/shell.ts";
import { fileExists } from "../libraries/filesystem.ts";

/* Constructs a filename for the database's SQL export */
const constructDatabaseExportFilename = (database: string): string => {
	const timestamp = new Date().getTime();

	return `${database}_${timestamp}.sql`;
};

/* Constructs the filepath in which the database's SQL export should be stored */
export const constructDatabaseExportFilepath = async (
	environment: Environment,
	database: string,
): Promise<string> => {
	const path = `${Deno.cwd()}/databases/${environment}`;

	if ((await fileExists(path)) === false) await Deno.mkdir(path, { recursive: true });
	return `${path}/${constructDatabaseExportFilename(database)}`;
};

/* Creates an SQL export of a local database */
export const exportLocalDatabase = async (): Promise<string> => {
	/* Set the environment */
	const environment: Environment = "dev";

	/* Get any variables required by the command */
	const server = validator("Local database server address", env.database.server);
	const port = validator("Local database server port", env.database.port);
	const username = validator("Local database username", env.database.username);
	const password = validator("Local database password", env.database.password);
	const database = validator("Local database server address", env.database.name);

	/* Get the SQL export's destination filepath */
	const filepath = await constructDatabaseExportFilepath(environment, database);

	/* The command to run */
	const command = `mysqldump -h ${server} -P ${port} -u ${username} -p${password} ${database}`;

	/* The command's status */
	const processStatus = await dockerExecute(command, null, filepath);

	/* The messages to output following completion */
	if (processStatus.success) success("Local database exported successfully.");
	else error("Unable to export local database.");

	return filepath;
};

/* Creates an SQL export of a remote database */
export const exportRemoteDatabase = async (environment: Environment): Promise<string> => {
	/* Get any variables required by the command */
	const username = validator(
		"Remote database username",
		env.dotfile.databaseUsername(environment),
	);
	const password = validator(
		"Remote database password",
		env.dotfile.databasePassword(environment),
	);
	const database = validator("Remote database name", env.dotfile.databaseName(environment));

	/* Get the SQL export's destination filepath */
	const filepath = await constructDatabaseExportFilepath(environment, database);

	/* The command to run */
	const command = `mysqldump -u ${username} -p${password} ${database}`;

	/* Get the server connection's credentials */
	const serverUsername = validator(
		"Server SSH username",
		env.dotfile.serverUsername(environment),
	);
	const serverAddress = validator("Server SSH address", env.dotfile.serverAddress(environment));

	/* The command's status */
	const processStatus = await remoteExecute(
		command,
		serverUsername,
		serverAddress,
		null,
		filepath,
	);

	/* The messages to output following completion */
	if (processStatus.success) success("Remote database exported successfully.");
	else error(`Unable to export remote database.`);

	return filepath;
};

/* Imports an SQL export to a local database */
export const importLocalDatabase = async (filepath: string): Promise<string> => {
	/* Get any variables required by the command */
	const server = validator("Local database server address", env.database.server);
	const port = validator("Local database server port", env.database.port);
	const username = validator("Local database username", env.database.username);
	const password = validator("Local database password", env.database.password);
	const database = validator("Local database server address", env.database.name);

	/* The command to run */
	const command = `mysql -h ${server} -P ${port} -u ${username} -p${password} ${database}`;

	/* The command's status */
	const processStatus = await dockerExecute(command, filepath);

	/* The messages to output following completion */
	if (processStatus.success) success("Local database imported successfully.");
	else error(`Unable to import local database.`);

	return filepath;
};

/* Imports an SQL export to a remote database */
export const importRemoteDatabase = async (
	environment: Environment,
	filepath: string,
): Promise<string> => {
	/* Get any variables required by the command */
	const username = validator(
		"Remote database username",
		env.dotfile.databaseUsername(environment),
	);
	const password = validator(
		"Remote database password",
		env.dotfile.databasePassword(environment),
	);
	const database = validator("Remote database name", env.dotfile.databaseName(environment));

	/* The command to run */
	const command = `mysql -u ${username} -p${password} ${database}`;

	/* Get the server connection's credentials */
	const serverUsername = validator(
		"Server SSH username",
		env.dotfile.serverUsername(environment),
	);
	const serverAddress = validator("Server SSH address", env.dotfile.serverAddress(environment));

	/* The command's status */
	const processStatus = await remoteExecute(command, serverUsername, serverAddress, filepath);

	/* The messages to output following completion */
	if (processStatus.success) success("Remote database imported successfully.");
	else error(`Unable to import remote database.`);

	return filepath;
};
