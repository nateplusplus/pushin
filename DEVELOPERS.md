# PushIn.js Development

There are just a few requirements to set up this project for local development:

1. install `node` v16 or higher
2. install `npm`
3. Setup your IDE with ESLint support

You can get set up with the following steps:

1. Clone this repo
2. Run `npm ci` to install all dependencies
3. Run `npm run storybook` to start up the development environment

The `npm run storybook` command will compile all code and begin running a node server at [localhost:6006](). The Storybook docs can be used to test various use cases for this library during development. The page will automatically refresh whenever you make a change to the source code.

Another useful way to develop this plugin is by writing tests as you make changes (TDD style). Unit tests can be run using Jest. During development, run `npm run test:watch` to continuously test code on each save.

NOTE: We enforce our code styles with ESLint and Prettier before committing. This means that you will need to fix any errors before committing your code.
