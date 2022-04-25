<!-- PROJECT LOGO -->

<br />

<div align="center">
    <a href="https://github.com/Bluegg/bluegg-cli">
        <img src="https://bluegg.co.uk/images/logo.svg" alt="The Project's Logo" width="160">
    </a>
    <h3 align="center">Bluegg CLI</h3>
    <p align="center">The command-line companion for worthy developers at Bluegg. 🤖</p>
    <a align="center" href="https://github.com/Bluegg/bluegg-open-source-disclaimer">Open Source Disclaimer</a>
</div>

<br />

<!-- GETTING STARTED -->

## Getting Started

### Homebrew

Installation of this tool as a Formula using [Homebrew](https://brew.sh) is strongly recommended.

```sh
brew install Bluegg/bluegg/bluegg-cli
```

### Usage

To get started, run the following.

```sh
bluegg --help
```

### Updating

You can update the Formula using Homebrew.

```sh
brew upgrade Bluegg/bluegg/bluegg-cli
```

Then confirm you're running the desired version.

```sh
bluegg --version
```

## For Developers

### Requirements

Install Deno

```sh
brew install deno
```

[Alternative installation instructions.](https://deno.land/manual/getting_started/installation)

### Making changes

1. Clone this repository.

```sh
git clone git@github.com:Bluegg/bluegg-cli.git bluegg-cli
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

5. Compile the code into a self-contained executable named `bluegg` at the project's root.

```sh
deno compile --allow-read --allow-write --allow-run --allow-env --output bluegg main.ts
```

6. Once all changes are committed, create a Tag and Release in GitHub. Both should follow the
   standard SemVer naming convention, E.G. `v1.2.3`. Use detailed release descriptions, following by
   the example of earlier releases.

7. Underneath the release notes, attach the previously generated `bluegg` binary.

8. Open the Release's Assets, and **make a note** of the `bluegg` binary's URL. This will be needed
   when updating the Tap.

9. Finish-up by updating [Bluegg's Homebrew Tap](https://github.com/Bluegg/homebrew-bluegg). Head to
   the repository for detailed instructions.

<!-- BLUEGG LOGO -->

<br />

<p align="center">
    <a href="https://bluegg.co.uk" target="_blank">
        <img src="https://bluegg.co.uk/apple-touch-icon.png" alt="Logo" width="40" height="40" style="border-radius: 0.5rem;">
    </a>
</p>
