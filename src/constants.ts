import { Environment } from "../types.ts";
import { exportEnvironmentVariables } from "./utilities/exportEnvironmentVariables.ts";

import { version } from "./version.ts";

/** The application's details represented as an object. */
export const app = {
	/** The base command used by the application. */
	command: "bluegg",
	/** The application's current version (SemVer). */
	version,
	/** The application's dotfile name. */
	dotfile: ".bluegg",
	/** The name of the application. */
	name: "Bluegg CLI",
	/** The description of the application. */
	description: "The command-line companion for worthy developers at Bluegg. 🤖",
	/** The author(s) of the application. */
	author: "Bluegg Development Team",
	/** The contact details of the application's author(s). */
	contact: "dev@bluegg.co.uk",
};

export const environments: Environment[] = ["dev", "staging", "production"];
export const localEnvironments: Environment[] = ["dev"];
export const remoteEnvironments: Environment[] = ["staging", "production"];

await exportEnvironmentVariables(".env");
await exportEnvironmentVariables(app.dotfile);

/** The project's environment variables represented as an object. */
export const env = {
	project: {
		/** The project's primary site URL. */
		url: (): URL | undefined => {
			const url = Deno.env.get("PRIMARY_SITE_URL");
			return url ? new URL(url) : undefined;
		},
		/** The project's name, constructed from the project's primary site URL. */
		name: (): string | undefined => {
			const url = Deno.env.get("PRIMARY_SITE_URL");
			return url ? new URL(url).hostname.split(".")[0] : undefined;
		},
	},
	database: {
		/** The database server's address or hostname. */
		server: Deno.env.get("CRAFT_DB_SERVER") ?? Deno.env.get("DB_SERVER") ?? null,
		/** The port through which the database should be accessed. */
		port: Deno.env.get("CRAFT_DB_PORT") ?? Deno.env.get("DB_PORT") ?? "3306",
		/** The database's name. */
		name: Deno.env.get("CRAFT_DB_DATABASE") ?? Deno.env.get("DB_DATABASE") ?? null,
		/** The database's username. */
		username: Deno.env.get("CRAFT_DB_USER") ?? Deno.env.get("DB_USER") ?? null,
		/** The database's password. */
		password: Deno.env.get("CRAFT_DB_PASSWORD") ?? Deno.env.get("DB_PASSWORD") ?? null,
	},
};

/** The project's dotfile variables represented as an object. */
export const dotfile = {
	docker: {
		/** The Docker container's name. */
		container: Deno.env.get("DOCKER_CONTAINER") ?? undefined,
	},
	/** The environment server's address or hostname. */
	serverAddress: (environment: Environment): string => {
		return Deno.env.get(`${environment.toUpperCase()}_SERVER_ADDRESS`) as string;
	},
	/** The environment server's SSH username. */
	serverUsername: (environment: Environment): string => {
		return Deno.env.get(`${environment.toUpperCase()}_SERVER_USERNAME`) as string;
	},
	/** The environment server's site directory. */
	siteDirectory: (environment: Environment): string => {
		return Deno.env.get(`${environment.toUpperCase()}_SITE_DIRECTORY`) as string;
	},
	/** The environment server's database name. */
	databaseName: (environment: Environment): string => {
		return Deno.env.get(`${environment.toUpperCase()}_DATABASE_NAME`) as string;
	},
	/** The environment server's database username. */
	databaseUsername: (environment: Environment): string => {
		return Deno.env.get(`${environment.toUpperCase()}_DATABASE_USERNAME`) as string;
	},
	/** The environment server's database password. */
	databasePassword: (environment: Environment): string => {
		return Deno.env.get(`${environment.toUpperCase()}_DATABASE_PASSWORD`) as string;
	},
};

/** The application's defaults. */
export const defaults = {
	/** The default server SSH username used for prompts. */
	defaultServerUsername: "forge",
	/** The default database username used for prompts. */
	defaultDatabaseUsername: "forge",
	/** The default directory in which the remote sites are located. */
	defaultRemoteSiteDirectory: "/home/forge",
	/** The default directory in which database exports should be located. */
	defaultDatabaseExportsDirectory: `databases`,
	/** The default directory in which local assets should be located. */
	defaultLocalAssetsDirectory: `web/assets`,
	/** The default directory in which remote assets should be located. */
	defaultRemoteAssetsDirectory: (environment: Environment): string => {
		return `${dotfile.serverAddress(environment)}/shared/web/assets`;
	},
};
