/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
// Changes done until this PR is merged (or cra-build-watch is compatible with react-scripts v5):
// https://github.com/Nargonath/cra-build-watch/pull/369

const spawn = require('cross-spawn');

// require it here to handle --help before checking prerequisites
require('../utils/cliHandler');

const [, , ...restArgs] = process.argv;
const scriptPath = require.resolve('../scripts');
const scriptArgs = [scriptPath, ...restArgs];

const result = spawn.sync('node', scriptArgs, { stdio: 'inherit', cwd: process.cwd() });
process.exit(result.status);
