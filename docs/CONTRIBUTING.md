# Stats.fm

## Style guide

This Stats.fm web repository follows the the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
We expect all of our developers to strictly follow these style guides.
Before you either push a commit or create a Pull Request, please check if there are no linter errors present. We recommend using Visual Studio Code with the recommended plugins installed for automatic linting.

### Before committing

We have adopted **[Conventional Commits](https://www.conventionalcommits.org)** as a ruleset for commit messages. In short, commit messages _must_ be formatted using one the following prefixes:

- `build` – for changes made to the build system
- `chore` – for changes that do not change production code
- `ci` – for changes made to Continuous Integration (CI) configuration
- `docs` – for updates made to the documentation
- `feat` – for newly introduced features
- `fix` – for bug fixes and patches
- `improvement` – for overall made improvements
- `perf` – for changes optimizing the overall performance
- `refactor` – for refactored code that does not change the public API
- `revert` – for when reverting back to a previous commit
- `style` – for code style changes (such as indentation)
- `test` – for when adding tests or assertions

Examples:

`feat: add support for removing tags`

`chore: add moment as dependency`

You may also specify a scope. We **strongly** encourage you to use scopes, because it's an excellent way of determining what part of the codebase has been changed.

Example:

`fix(font): change font`

## Installation

1. Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) and the recommend extensions
2. Clone this repository to your local drive by running `git clone git@github.com:statsfm/web-frontend.git core` in the directory you wish to clone Stats.fm web in.
3. Run `yarn install` to install all dependencies.
4. Run `yarn build` to build for production.
5. Finally, run `yarn dev`. This will spin up a dev server.

You can now head over to <http://localhost:3000> and you're ready to go
