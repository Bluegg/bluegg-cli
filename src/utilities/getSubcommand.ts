import { Command } from "../../types.ts";

/**
 * Examines the user's entered subcommand(s) and determines which accepted subcommand to return.
 *
 * @param validSubcommands A list of accepted subcommands to examine.
 * @param subcommand The subcommand entered by the user.
 * @returns The accepted subcommand.
 */
export default function getSubcommand(validSubcommands: Command[], subcommand: string) {
	const validSubcommand = validSubcommands.find((validSubcommand) => {
		if (validSubcommand.aliases) {
			if (validSubcommand.aliases.includes(subcommand)) return validSubcommand;
		}
	});

	return validSubcommand;
}
