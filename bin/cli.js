#!/usr/bin/env node

process.title = 'Node Packer Test CLI';

require('dotenv').config();

const { log } = require('console');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const colors = require('ansi-colors');
const fancyLog = require('fancy-log');
const { yargs } = require('@saurabhdeep/cli-test-common/singleton');
const commonCmds = require('@saurabhdeep/cli-test-common/lib/gulp/commands');
const sfdcCmds = require('@saurabhdeep/cli-test-sfdc/lib/gulp/commands');
const run = require('../lib/modules/rungulp');
const timer = require('../lib/modules/timer');

let allCommands = commonCmds.concat(sfdcCmds);
allCommands = _.orderBy(allCommands, 'command');

yargs
  .commandDir(path.join(__dirname, '..', 'lib', 'commands'), {
    recurse: true,
    visit: (commandObject) => commandObject(),
  })
  .command('*', false, () => { }, (argv) => {
    if (argv._.length === 0) {
      log(fs.readFileSync(path.join(__dirname, '..', 'lib', 'modules', 'logo.txt')).toString());
      log('! Welcome to Node Packer Test CLI!');
      log('? Please type npkr --help for information.');
      process.exit(0);
    } else {
      fancyLog('ERROR:', colors.red('This is an invalid command.'));
      process.exit(1);
    }
  })
  .wrap(Math.min(130, yargs.terminalWidth()))
  .alias('h', 'help')
  .alias('v', 'version')
  .scriptName('npkr');

allCommands.forEach((currCmd) => {
  const cmd = currCmd;
  yargs.command(cmd.command, cmd.desc, cmd.builder, (argv) => {
    const startTime = timer.logStart(argv._[0]);
    run.runGulp(argv._[0])
      .then(() => {
        timer.logFinish(argv._[0], startTime);
      })
      .catch((err) => {
        timer.showErrorAndExit(argv._[0], err, 1);
      });
  });
});

const commands = yargs.getCommandInstance().getCommands();
const { argv } = yargs;
