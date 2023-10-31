<!-- PROJECT LOGO -->

<br />

<div align="center">
    <a href="https://github.com/towardstudio/toward-cli">
        <h3 align="center">Toward CLI</h3>
    </a>
    <p align="center">The command-line companion for worthy developers at Toward. 🤖</p>
    <a align="center" href="https://github.com/towardstudio/toward-open-source-disclaimer">Open Source Disclaimer</a>
</div>

<br />

<!-- GETTING STARTED -->

## Getting Started

### Homebrew

Installation of this tool as a Formula using [Homebrew](https://brew.sh) is strongly recommended.

```sh
brew install towardstudio/toward/toward-cli
```

### Usage

To get started, run the following.

```sh
toward --help
```

### Updating

You can update the Formula using Homebrew.

```sh
brew upgrade toward-cli
```

Then confirm you're running the desired version.

```sh
toward --version
```

## Example Toward File

```sh
# The Docker container's name
DOCKER_CONTAINER=

/** The Assets file path */
ASSET_PATH=web/assets

# Details and credentials for the project's staging server
STAGING_SERVER_IP=
STAGING_SERVER_ADDRESS=
STAGING_SERVER_USERNAME=
STAGING_SITE_DIRECTORY=
STAGING_DATABASE_NAME=
STAGING_DATABASE_USERNAME=
STAGING_DATABASE_PASSWORD=

# Details and credentials for the project's production server
PRODUCTION_SERVER_IP=
PRODUCTION_SERVER_ADDRESS=
PRODUCTION_SERVER_USERNAME=
PRODUCTION_SITE_DIRECTORY=
PRODUCTION_DATABASE_NAME=
PRODUCTION_DATABASE_USERNAME=
PRODUCTION_DATABASE_PASSWORD=
```

## For Developers

### Requirements

Install Deno.

```sh
brew install deno
```

[Alternative installation instructions.](https://deno.land/manual/getting_started/installation)

### Making changes

1. Clone this repository.

```sh
git clone git@github.com:towardstudio/toward-cli.git toward-cli
```

2. Before committing any changes, _always_ run Deno's built-in linter at the project's root, and
   resolve any issues.

```sh
deno lint
```

3. Before committing any changes, _always_ run Deno's built-in formatter at the project's root.

```sh
deno fmt
```

4. When everything is ready for release, update the `version` value in
   [`/src/version.ts`](/src/version.ts).

5. Compile the code into a self-contained executable named `toward` at the project's root.

```sh
deno compile --allow-read --allow-write --allow-run --allow-env --output toward main.ts
```

6. You can test your local changes by creating an alias:

```sh
alias towardcli="deno run --allow-read --allow-write --allow-run --allow-env <path to main.ts>"
```

7. You then can run that within any project with subcommands to make sure your updates work:

```sh
towardcli assets pull -e staging
```

8. Once all changes are committed, create a Tag and Release in GitHub. Both should follow the
   standard SemVer naming convention, E.G. `v1.2.3`. Use detailed release descriptions, following by
   the example of earlier releases.

9. Underneath the release notes, attach the previously generated `toward` binary.

10. Open the Release's Assets, and **make a note** of the `toward` binary's URL. This will be needed
    when updating the Tap.

11. Finish-up by updating [Toward's Homebrew Tap](https://github.com/towardstudio/homebrew-bluegg).
    Head to the repository for detailed instructions.
