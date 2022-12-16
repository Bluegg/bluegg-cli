import { bold } from "../../deps.ts";

/**
 * Determines if a given value exists, and if not, prompts the user to enter a value.
 *
 * @param name The name of the value that the user can identify.
 * @param value The value to check.
 * @returns The value, either as it was given or as entered by the user.
 */
export default function promptIfEmpty(name: string, value: unknown) {
	if (!value) return prompt(`${bold(name)} is missing. Enter a value:`) as string;

	return value as string;
}
