// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version, author, license } = require('../package.json');

/** This is a banner that's being shared between Rollup and Webpack builds. */
module.exports = `Pushin.js - v${version}\nAuthor: ${author}\nLicense: ${license}`;
