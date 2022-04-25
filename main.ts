/*
	Main
	The application's entry point
*/

/* Imports */
import { bold, cyan, parseArgs } from "./deps.ts";
import { app, invalidSubcommand, missingSubcommand } from "./src/constants.ts";
import { createDotfile } from "./src/dotfile.ts";
import { error, warning } from "./src/libraries/messages.ts";
import { fileExists } from "./src/libraries/filesystem.ts";
import { database, meta as databaseMeta } from "./src/subcommands/database/database.ts";

/* The command's instructions */
const instructions = `${bold(cyan(`${app.name} ${app.version}`))}
${bold(`${app.description}`)}
Author: ${app.author} <${app.contact}>

${bold("Syntax:")} ${app.command} [subcommand] [arguments]

${bold("Subcommands:")}
${bold(`${databaseMeta.subcommands.join(", ")}`)}	${databaseMeta.description}

${bold("Arguments:")}
${bold("-v, --version")}	Displays the installed version of the application.
${bold("-h, --help")}	Displays usage examples and supported syntax.`;

/* Get any arguments entered by the user */
const args = parseArgs(Deno.args);

/* Get the subcommand entered by the user */
const subcommand = args._.shift() as string;

/* Logic for the command's `--version` argument */
const version = (): void => {
	console.info(app.name, app.version);
	Deno.exit();
};

/* Logic for the command's `--help` argument */
const help = (): void => {
	console.info(instructions);
	Deno.exit();
};

/* Checks for the existence of the dotenv file */
if ((await fileExists(`${Deno.cwd()}/.env`)) === false) {
	warning(`There's no ${bold(".env")} file in this directory. Are you in the correct directory?`);
}

/* Checks for the existence of the application's dotfile and prompts the user to create one */
if ((await fileExists(`${Deno.cwd()}/${app.dotfile}`)) === false) {
	warning(`There's no ${bold(app.dotfile)} file in this directory.`);
	const confirmed = confirm("Create one now? (Recommended)");
	if (confirmed) {
		await createDotfile();
		Deno.exit();
	}
}

/* Process the subcommands or arguments entered by the user */
if (subcommand) {
	if (subcommand === "database" || subcommand === "db") database(args);
	else error(invalidSubcommand(subcommand));
} else {
	if (args.v || args.version) version();
	else if (args.h || args.help) help();
	else error(missingSubcommand());

	Deno.exit();
}
