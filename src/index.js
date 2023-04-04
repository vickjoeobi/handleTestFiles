const core = require('@actions/core');
const { context } = require('@actions/github');
const gist = require('./gist');
const validation = require('./validation');
const repo = require('./repo');
const fs = require('fs').promises;
const path = require('path');

async function main() {
  try {
    const inputs = {
      task: core.getInput('task'),
      gistId: core.getInput('gist_id'),
      initialFilename: core.getInput('initial_filename'),
      finalFilename: core.getInput('final_filename'),
      expectedTestDataArray: core.getInput('expected_test_data_array') ? JSON.parse(core.getInput('expected_test_data_array')) : null,
      filePath: core.getInput('file_path'),
      token: core.getInput('token'),
      username: context.repo.owner,
      repo: context.repo.repo
    };

    if (inputs.task === 'get') {
      const isValidGist = await gist.checkGist(inputs);
      if (isValidGist) {
        const gistData = await gist.getGistContent(inputs);
        const tempFilePath = path.join(process.env.GITHUB_WORKSPACE, 'temp_gist_data.json');
        await fs.writeFile(tempFilePath, JSON.stringify(gistData, null, 2));
        core.setOutput('temp_gist_data_path', tempFilePath);
      }
    } else if (inputs.task === 'update') {
      const repoFileExists = await repo.checkFileExistence(inputs);
      const isValidGist = await gist.checkGist(inputs);

      if (repoFileExists && isValidGist) {
        const isValidRepoFile = await validation.validateRepoFileContent(inputs);
        if (isValidRepoFile) {
          await gist.updateGist(inputs);
        }
      }
    } else {
      throw new Error(`Invalid task: ${inputs.task}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
