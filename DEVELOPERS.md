# PushIn.js Development

There are just a few requirements to set up this project for local development:

1. install `node` v16 or higher
2. install `npm`
3. Setup your IDE with ESLint support

You can get set up with the following steps:

1. Clone this repo
2. Run `npm ci` to install all dependencies
3. Run `npm start` to start up development environment

The `npm start` command will compile all code and begin running a node server at [localhost:8080](). The page will automatically refresh whenever you make a change to the source code.

NOTE: We enforce our code styles with ESLint and Prettier before committing. This means that you will need to fix any errors before committing your code.
