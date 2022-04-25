/*
	Messages
	Pre-formatted strings for outputting messages throughout the application
*/

/* Imports */
import { bold, cyan, green, red, yellow } from "../../deps.ts";

/* Used for error message output throughout the application */
export const error = (message: string, exit?: boolean): void => {
	if (message) console.error(bold(red("Error:")), message);
	if (exit) Deno.exit();
};

/* Used for warning message output throughout the application */
export const warning = (message: string, exit?: boolean): void => {
	if (message) console.warn(bold(yellow("Warning:")), message);
	if (exit) Deno.exit();
};

/* Used for informative message output throughout the application */
export const info = (message: string, exit?: boolean): void => {
	if (message) console.info(bold(cyan("Info:")), message);
	if (exit) Deno.exit();
};

/* Used for success message output throughout the application */
export const success = (message: string, exit?: boolean): void => {
	if (message) console.log(bold(green("Success:")), message);
	if (exit) Deno.exit();
};
