import { Args } from "../../deps.ts";
import { Argument } from "../../types.ts";

/**
 * Get the user-entered value of a given accepted argument.
 *
 * @param argument The accepted argument.
 * @param args The arguments entered by the user.
 * @returns The accepted argument.
 */
export default function getArgumentValue(argument: Argument, args: Args) {
	const key = argument.flags.filter((key) => Object.keys(args).includes(key))[0];
	const value: string = args[key];

	return value;
}
