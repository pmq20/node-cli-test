module.exports = {
  logStart: (cmdName) => {
    const fancyLog = require('fancy-log');
    const start = process.hrtime();
    fancyLog(`Running '${cmdName}'...`);
    return start;
  },

  logFinish: async (cmdName, start) => {
    const colors = require('ansi-colors');
    const fancyLog = require('fancy-log');
    const prettyTime = require('pretty-hrtime');
    const hrDuration = process.hrtime(start);
    fancyLog(`Finished '${cmdName}' after ${colors.magenta(prettyTime(hrDuration))}`);
  },

  showErrorAndExit: async (cmdName, err, errCode) => {
    const colors = require('ansi-colors');
    const fancyLog = require('fancy-log');
    const { processError } = require('@saurabhdeep/cli-test-common/lib/util/misc');
    const error = processError(Array.isArray(err) ? err[0] : err);
    fancyLog(`${cmdName} - ERROR:`, colors.red(error.message));
    console.log(error);
    process.exit(errCode);
  },
};
