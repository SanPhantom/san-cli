const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const validateProjName = require('validate-npm-package-name');
const { exit } = require("process");
const chalk = require("chalk");
const inquirer = require("inquirer");
const EventEmitter = require("events");
const Creator = require("./Creator");

async function create (projName, options) {
  const cwd = options.cwd || process.cwd();
  const inCurrent = projName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projName;
  const targetDir = path.resolve(cwd, projName || '.');

  const nameResult = validateProjName(name);

  if (!nameResult.validForNewPackages) {
    console.info(chalk.blue(`Invalid project name: ${name}`));
    nameResult.errors && nameResult.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    nameResult.warnings && nameResult.warnings.forEach(warn => {
      console.warn(chalk.red.dim('Warning: ' + warn))
    })
    exit(1);
  }

  if (fs.existsSync(targetDir)) {
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: 'Generate project in current dir?'
        }
      ]);
      if (!ok) {
        return;
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ]);
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fs.unlinkSync(targetDir);
      }
    }
  }

  const creator = new Creator(name, targetDir);
  await creator.create();
  console.log(creator);
}

module.exports = (...args) => {
  return create(...args);
}