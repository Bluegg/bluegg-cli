/*
	Dependencies
	Third-party modules and libraries that the application relies upon
*/

/* Loads all environment variables from the selected files into the process */
export { config } from "https://deno.land/std/dotenv/mod.ts";

/* A module to print ANSI terminal colours */
export { bold, cyan, green, italic, red, yellow } from "https://deno.land/std/fmt/colors.ts";

/* A command line arguments parser */
export { parse as parseArgs } from "https://deno.land/std/flags/mod.ts";
export type { Args } from "https://deno.land/std/flags/mod.ts";

/* Readers and writers for data streaming */
export { writeAll } from "https://deno.land/std/streams/conversion.ts";
