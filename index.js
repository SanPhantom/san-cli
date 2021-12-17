#!/usr/bin/env node

const { program } = require("commander");
const package = require("./package.json");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

program.version(`@san/cli ${package.version}`)
  .usage('<command> [options]');

// init
program.command("init")
.description("init a new peoject")
.action(async () => {
  require('./lib/create.js')('init sanui', {});
})

program.command("create <name>")
  .option('-f, --force', 'Overwrite target directory if it exists')
  .description("create a new project")
  .action((name, option) => {
    require('./lib/create.js')(name, option);
  });

program.parse(process.argv);