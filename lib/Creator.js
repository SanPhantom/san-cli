
const EventEmitter = require("events");
const util = require("util");
const downloadGitRepo = require("download-git-repo");
const { default: ora } = require("ora");
const inquirer = require("inquirer");

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail('Request failed, refresh...');
  }
}

module.exports = class Creator extends EventEmitter {
  constructor(name, context) {
    super();

    this.name = name;
    this.context = process.env.SAN_CLI_CONTEXT = context;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
    if (!repoList) return;

    const repos = repoList.map(item => item.name);

    const { repo } = await inquirer.prompt({})

  }

  async download (repo, tag) {
    const requestUrl = `san-cli/${repo}${tag?'#'+tag:''}`;
    await wrapLoading()
  }

  async create() {
    const repo = await this.getRepo();
    const tag = await this.getTag(repo);

    await this.download(repo, tag);
  }

}