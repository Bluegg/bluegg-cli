/**
 * Determines the existence of a given file.
 *
 * @param filepath The file's filepath.
 * @returns The determination as described (*true or false*).
 */
export default async function doesFileExist(filepath: string) {
	try {
		await Deno.stat(filepath);
		return true;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) return false;
		else throw error;
	}
}
