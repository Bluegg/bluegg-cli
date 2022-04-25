/*
	Filesystem
	Helper functions for logic related to the handling of files and directories
*/

/* Check whether or not a given file exists */
export const fileExists = async (filepath: string): Promise<boolean> => {
	try {
		await Deno.stat(filepath);
		return true;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) return false;
		else throw error;
	}
};
