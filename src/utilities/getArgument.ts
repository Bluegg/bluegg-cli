import { Args } from "../../deps.ts";
import { Argument } from "../../types.ts";

/**
 * Examines the user's entered argument(s) and determines which accepted argument to return.
 *
 * @param acceptedArguments A list of accepted arguments to examine.
 * @param args The arguments entered by the user.
 * @returns The accepted argument.
 */
export default function getArgument(acceptedArguments: Argument[], args: Args) {
	const acceptedArgument = acceptedArguments.filter((acceptedArgument) => {
		return acceptedArgument.flags.some((key) => Object.keys(args).includes(key));
	})[0];

	return acceptedArgument;
}
