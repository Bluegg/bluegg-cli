/*
	Constants
	Unmodifiable values that are used throughout the application
*/

/* Imports */
import { Environment } from "../types.ts";
import { bold } from "../deps.ts";
import { version } from "./version.ts";
import { exportEnvironmentVariablesFromFile } from "./libraries/environment.ts";

/* The application's details represented as an object */
export const app = {
	/* The base command used by the application */
	command: "bluegg",
	/* The application's current version (SemVer) */
	version: version,
	/* The application's dotfile name */
	dotfile: ".bluegg",
	/* The name of the application */
	name: "Bluegg CLI",
	/* The description of the application */
	description: "The command-line companion for worthy developers at Bluegg. 🤖",
	/* The author(s) of the application */
	author: "Bluegg Development Team",
	/* The contact details of the application's author(s) */
	contact: "dev@bluegg.co.uk",
};

/* Exports all environment variables for use throughout the application */
await exportEnvironmentVariablesFromFile(".env");
await exportEnvironmentVariablesFromFile(app.dotfile);

/* The project's environment variables represented as an object */
export const env = {
	defaults: {
		/* The default server SSH username used for prompts */
		serverUsername: "forge",
		databaseUsername: "forge",
	},
	docker: {
		/* The Docker container's name */
		container: Deno.env.get("DOCKER_CONTAINER") ?? null,
	},
	project: {
		/* The project's primary site URL */
		url: (): URL | undefined => {
			const url = Deno.env.get("PRIMARY_SITE_URL");
			return url ? new URL(url) : undefined;
		},
		/* The project's name, constructed from the project's primary site URL */
		name: (): string | undefined => {
			const url = Deno.env.get("PRIMARY_SITE_URL");
			return url ? new URL(url).hostname.split(".")[0] : undefined;
		},
	},
	database: {
		/* The database server's address or hostname */
		server: Deno.env.get("CRAFT_DB_SERVER") ?? Deno.env.get("DB_SERVER") ?? null,
		/* The port through which the database should be accessed */
		port: Deno.env.get("CRAFT_DB_PORT") ?? Deno.env.get("DB_PORT") ?? "3306",
		/* The database's name */
		name: Deno.env.get("CRAFT_DB_DATABASE") ?? Deno.env.get("DB_DATABASE") ?? null,
		/* The database's username */
		username: Deno.env.get("CRAFT_DB_USER") ?? Deno.env.get("DB_USER") ?? null,
		/* The database's password */
		password: Deno.env.get("CRAFT_DB_PASSWORD") ?? Deno.env.get("DB_PASSWORD") ?? null,
	},
	dotfile: {
		/* The environment server's address or hostname */
		serverAddress: (environment: Environment): string => {
			return Deno.env.get(`${environment.toUpperCase()}_SERVER_ADDRESS`) as string;
		},
		/* The environment server's port */
		serverPort: (environment: Environment): string => {
			return Deno.env.get(`${environment.toUpperCase()}_SERVER_PORT`) as string;
		},
		/* The environment server's SSH username */
		serverUsername: (environment: Environment): string => {
			return Deno.env.get(`${environment.toUpperCase()}_SERVER_USERNAME`) as string;
		},
		/* The environment server's database name */
		databaseName: (environment: Environment): string => {
			return Deno.env.get(`${environment.toUpperCase()}_DATABASE_NAME`) as string;
		},
		/* The environment server's database username */
		databaseUsername: (environment: Environment): string => {
			return Deno.env.get(`${environment.toUpperCase()}_DATABASE_USERNAME`) as string;
		},
		/* The environment server's database password */
		databasePassword: (environment: Environment): string => {
			return Deno.env.get(`${environment.toUpperCase()}_DATABASE_PASSWORD`) as string;
		},
	},
};

/* The string informing users of an invalid subcommand */
export const invalidSubcommand = (subcommand: string): string => {
	return `"${subcommand}" is not a recognised subcommand. Use ${bold("--help")} for help.`;
};

/* The string informing users of a missing subcommand */
export const missingSubcommand = (): string => {
	return `Enter a recognised subcommand or argument(s). Use ${bold("--help")} for help.`;
};

/* The string informing users that an additional subcommand is required */
export const additionalSubcommandRequired = (): string => {
	return `Additional subcommands are required. Use ${bold("--help")} for help.`;
};
