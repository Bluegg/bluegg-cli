import { gray } from "../../../deps.ts";
import { Environment } from "../../../types.ts";
import { defaults, env } from "../../constants.ts";
import promptIfEmpty from "../../utilities/promptIfEmpty.ts";
import ErrorMessage from "../messages/ErrorMessage.ts";
import SuccessMessage from "../messages/SuccessMessage.ts";
import Shell from "../Shell.ts";

export default class RemoteSync {
	private serverUsername: string;
	private serverAddress: string;
	private environment: Environment;
	private source: string | undefined;
	private destination: string | undefined;
	private options: string;
	public localFilepath: string;
	public remoteFilepath: string;

	constructor(environment: Environment, source?: string, destination?: string, options?: string) {
		this.serverUsername = promptIfEmpty(
			"Server SSH Username",
			env.dotfile.serverUsername(environment),
		);
		this.serverAddress = promptIfEmpty(
			"Server SSH address",
			env.dotfile.serverAddress(environment),
		);
		this.environment = environment;
		this.source = source;
		this.destination = destination;
		this.options = options ?? "";
		this.localFilepath = this._localFilepath();
		this.remoteFilepath = this._remoteFilepath();
	}

	/**
	 * Gets the filepath in which the local assets are expected to be located.
	 *
	 * @returns The local assets filepath.
	 */
	private _localFilepath() {
		const path = defaults.defaultLocalAssetsDirectory;

		return path;
	}

	/**
	 * Gets the filepath in which the remote assets are expected to be located.
	 *
	 * @returns The remote assets filepath.
	 */
	private _remoteFilepath() {
		const siteDirectory = env.dotfile.siteDirectory(this.environment);
		const assetsDirectory = defaults.defaultRemoteAssetsDirectory(this.environment);
		const path = `${siteDirectory}/${assetsDirectory}`;

		return path;
	}

	/**
	 * Downloads the assets from the chosen filepath.
	 *
	 * @returns The download's filepath.
	 */
	public async download() {
		const localFilepath = `${this.destination ?? this.localFilepath}`;
		const remoteFilepath = `${this.source ?? this.remoteFilepath}/`;

		console.log(`${gray(`Downloading ${remoteFilepath} to ${localFilepath}...`)}`);

		const command =
			`rsync -ah --stats ${this.options} ${this.serverUsername}@${this.serverAddress}:${remoteFilepath} ${localFilepath}`;

		const shell = new Shell(command);
		const process = await shell.executeInLocal();

		if (process.success) {
			new SuccessMessage("Remote assets downloaded successfully.");
		} else new ErrorMessage("Unable to download remote assets.");

		return localFilepath;
	}

	/**
	 * Uploads the assets to the chosen filepath.
	 *
	 * @returns The upload's filepath.
	 */
	public async upload() {
		const localFilepath = `${this.source ?? this.localFilepath}/`;
		const remoteFilepath = `${this.destination ?? this.remoteFilepath}`;

		console.log(`${gray(`Uploading ${localFilepath} to ${remoteFilepath}...`)}`);

		const command =
			`rsync -ah --stats ${this.options} ${localFilepath} ${this.serverUsername}@${this.serverAddress}:${remoteFilepath}`;

		const shell = new Shell(command);
		const process = await shell.executeInLocal();

		if (process.success) {
			new SuccessMessage("Local assets uploaded successfully.");
		} else new ErrorMessage("Unable to upload local assets.");

		return remoteFilepath;
	}
}
