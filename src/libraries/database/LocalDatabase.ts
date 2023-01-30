import { gray } from "../../../deps.ts";
import { Environment } from "../../../types.ts";
import { env, options } from "../../constants.ts";
import doesFileExist from "../../utilities/doesFileExist.ts";
import promptIfEmpty from "../../utilities/promptIfEmpty.ts";
import ErrorMessage from "../messages/ErrorMessage.ts";
import SuccessMessage from "../messages/SuccessMessage.ts";
import Shell from "../Shell.ts";

export default class LocalDatabase {
	private container: string;
	private server: string;
	private port: string;
	private username: string;
	private password: string;
	private name: string;
	private environment: Environment;
	private options: string;
	private datestamp: string;
	private timestamp: string;
	public filename: string;
	public filepath: Promise<string>;

	constructor(options?: string) {
		this.container = promptIfEmpty("Docker container", env.docker.container);
		this.server = promptIfEmpty("Local database server address", env.database.server);
		this.port = promptIfEmpty("Local database server port", env.database.port);
		this.username = promptIfEmpty("Local database username", env.database.username);
		this.password = promptIfEmpty("Local database password", env.database.password);
		this.name = promptIfEmpty("Local database name", env.database.name);
		this.environment = "dev";
		this.options = options ?? "";
		this.datestamp = this._datestamp();
		this.timestamp = this._timestamp();
		this.filename = this._filename();
		this.filepath = this._filepath();
	}

	/**
	 * Creates a string of the current date.
	 *
	 * @returns The datestamp string.
	 */
	_datestamp() {
		const datestamp = new Date().toISOString().split("T")[0];

		return datestamp;
	}

	/**
	 * Creates a string of the current time.
	 *
	 * @returns The timestamp string.
	 */
	_timestamp() {
		const timestamp = new Date().toLocaleTimeString().replaceAll(":", "-");

		return timestamp;
	}

	/**
	 * Constructs a suitable filename for the database's SQL export.
	 *
	 * @returns The newly constructed filename.
	 */
	_filename() {
		return `${this.timestamp}_${this.name}.sql`;
	}

	/**
	 * Constructs the filepath in which the database's SQL export will be located.
	 *
	 * @returns The database export's filepath.
	 */
	async _filepath() {
		const path =
			`${options.defaultDatabaseExportsDirectory}/${this.environment}/${this.datestamp}`;

		if ((await doesFileExist(path)) === false) await Deno.mkdir(path, { recursive: true });
		return `${path}/${this.filename}`;
	}

	/**
	 * Imports a given SQL file to a local database.
	 *
	 * @param filepath The SQL file's filepath.
	 * @returns The imported SQL file's filepath.
	 */
	async import(filepath: string) {
		if ((await doesFileExist(filepath)) === false) {
			new ErrorMessage(`The following file does not exist: ${filepath}`, true);
		}

		const command =
			`mysql -h ${this.server} -P ${this.port} -u ${this.username} -p${this.password} ${this.name}`;

		const shell = new Shell(command, filepath);
		const process = await shell.executeInDocker(this.container);

		if (process.success) {
			new SuccessMessage("Local database imported successfully.");
		} else new ErrorMessage("Unable to import local database.");

		return filepath;
	}

	/**
	 * Creates an SQL file from an export of a local database.
	 *
	 * @returns The exported SQL file's filepath.
	 */
	async export() {
		const command =
			`mysqldump -h ${this.server} -P ${this.port} -u ${this.username} -p${this.password} ${this.name} ${this.options}`;
		const filepath = await this.filepath;

		const shell = new Shell(command, undefined, filepath);
		const process = await shell.executeInDocker(this.container);

		if (process.success) {
			new SuccessMessage(`Local database exported successfully. ${gray(this.filename)}`);
		} else new ErrorMessage("Unable to export local database.");

		return filepath;
	}
}
