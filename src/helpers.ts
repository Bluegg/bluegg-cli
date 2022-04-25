/*
	Helpers
	Helper functions for generic logic used throughout the application
*/

import { bold } from "../deps.ts";

/* Checks if a given value exists, and if not, prompts the user to enter the value */
export const validator = (name: string, value: unknown): string => {
	if (!value) return prompt(`${bold(name)} is missing. Enter a value:`) as string;

	return value as string;
};
