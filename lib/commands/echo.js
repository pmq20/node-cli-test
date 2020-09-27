const CMD_NAME = 'echo';

// eslint-disable-next-line no-unused-vars
const execCmd = async (argv) => {
  console.log(`Hello there! You asked me to print: ${argv.message}`);
  return true;
};

module.exports = () => {
  const cmd = {};

  cmd.command = CMD_NAME;
  cmd.desc = 'Test command to print back your message';
  cmd.builder = yargs => yargs.options({
    m: {
      alias: 'message',
      describe: 'Message to echo',
      group: CMD_NAME,
      demandOption: true,
      requiresArg: true,
    },
  });
  cmd.handler = (argv) => {
    const timer = require('../modules/timer');
    const startTime = timer.logStart(CMD_NAME);
    execCmd(argv)
      .then(() => {
        timer.logFinish(CMD_NAME, startTime);
      })
      .catch((err) => {
        timer.showErrorAndExit(CMD_NAME, err, 1);
      });
  };
  return cmd;
};
