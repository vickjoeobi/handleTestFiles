const core = require('@actions/core');
const { context } = require('@actions/github');
const gist = require('./gist');
const validation = require('./validation');
const repo = require('./repo');

async function main() {
  try {
    const inputs = {
      username: context.repo.owner,
      repo: context.repo.repo,
      gistId: core.getInput('gist_id'),
      initialFilename: core.getInput('initial_filename'),
      finalFilename: core.getInput('final_filename'),
      expectedTestDataArray: JSON.parse(core.getInput('expected_test_data_array')),
      filePath: core.getInput('file_path'),
      token: process.env.BMW_TEST || process.env.GITHUB_TOKEN
    };

    const repoFileExists = await repo.checkFileExistence(inputs);
    const isValidGist = await gist.checkGist(inputs);

    if (repoFileExists && isValidGist) {
      const isValidRepoFile = await validation.validateRepoFileContent(inputs);
      if (isValidRepoFile) {
        await gist.updateGist(inputs);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
