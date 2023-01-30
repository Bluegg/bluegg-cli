import { gray } from "../../../deps.ts";
import { Environment } from "../../../types.ts";
import { defaults, env } from "../../constants.ts";
import doesFileExist from "../../utilities/doesFileExist.ts";
import promptIfEmpty from "../../utilities/promptIfEmpty.ts";
import ErrorMessage from "../messages/ErrorMessage.ts";
import SuccessMessage from "../messages/SuccessMessage.ts";
import Shell from "../Shell.ts";

export default class RemoteDatabase {
	private serverUsername: string;
	private serverAddress: string;
	private username: string;
	private password: string;
	private name: string;
	private environment: Environment;
	private options: string;
	private datestamp: string;
	private timestamp: string;
	public filename: string;
	public filepath: Promise<string>;

	constructor(environment: Environment, options?: string) {
		this.serverUsername = promptIfEmpty(
			"Server SSH Username",
			env.dotfile.serverUsername(environment),
		);
		this.serverAddress = promptIfEmpty(
			"Server SSH address",
			env.dotfile.serverAddress(environment),
		);
		this.username = promptIfEmpty(
			"Remote database username",
			env.dotfile.databaseUsername(environment),
		);
		this.password = promptIfEmpty(
			"Remote database password",
			env.dotfile.databasePassword(environment),
		);
		this.name = promptIfEmpty("Remote database name", env.dotfile.databaseName(environment));
		this.environment = environment;
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
	private _datestamp() {
		const datestamp = new Date().toISOString().split("T")[0];

		return datestamp;
	}

	/**
	 * Creates a string of the current time.
	 *
	 * @returns The timestamp string.
	 */
	private _timestamp() {
		const timestamp = new Date().toLocaleTimeString().replaceAll(":", "-");

		return timestamp;
	}

	/**
	 * Constructs a suitable filename for the database's SQL export.
	 *
	 * @returns The newly constructed filename.
	 */
	private _filename() {
		return `${this.timestamp}_${this.name}.sql`;
	}

	/**
	 * Constructs the filepath in which the database's SQL export will be located.
	 *
	 * @returns The database export's filepath.
	 */
	private async _filepath() {
		const path =
			`${defaults.defaultDatabaseExportsDirectory}/${this.environment}/${this.datestamp}`;

		if ((await doesFileExist(path)) === false) await Deno.mkdir(path, { recursive: true });
		return `${path}/${this.filename}`;
	}

	/**
	 * Imports a given SQL file to a remote database.
	 *
	 * @param filepath The SQL file's filepath.
	 * @returns The imported SQL file's filepath.
	 */
	async import(filepath: string) {
		if ((await doesFileExist(filepath)) === false) {
			new ErrorMessage(`The following file does not exist: ${filepath}`);
		}

		const command =
			`MYSQL_PWD=${this.password} mysql -u ${this.username} ${this.name} ${this.options}`;

		const shell = new Shell(command, filepath);
		const process = await shell.executeOnRemote(this.serverUsername, this.serverAddress);

		if (process.success) {
			new SuccessMessage(`Remote database imported successfully.`);
		} else new ErrorMessage(`Unable to import remote database.`);

		return filepath;
	}

	/**
	 * Creates an SQL file from an export of a local database.
	 *
	 * @returns The exported SQL file's filepath.
	 */
	async export() {
		const command =
			`MYSQL_PWD=${this.password} mysqldump -u ${this.username} ${this.name} ${this.options}`;
		const filepath = await this.filepath;

		const shell = new Shell(command, undefined, filepath);
		const process = await shell.executeOnRemote(this.serverUsername, this.serverAddress);

		if (process.success) {
			new SuccessMessage(`Remote database exported successfully. ${gray(this.filename)}`);
		} else new ErrorMessage(`Unable to export remote database.`);

		return filepath;
	}
}
