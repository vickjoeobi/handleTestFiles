const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;

async function checkGist(inputs) {
  const octokit = new Octokit({ auth: inputs.token });

  try {
    const gist = await octokit.gists.get({ gist_id: inputs.gistId });

    if (gist && gist.data.files[inputs.initialFilename]) {
      console.log('The gist ID is valid and the initial file exists.');
      return true;
    } else {
      console.log('The gist ID is not valid or the initial file does not exist.');
      return false;
    }
  } catch (error) {
    console.log('Error checking gist:', error.message);
    return false;
  }
}

async function updateGist(inputs) {
  const octokit = new Octokit({ auth: inputs.token });

  try {
    const fileContent = await fs.readFile(inputs.filePath, 'utf-8');
    const updatedFiles = {
      [inputs.finalFilename]: {
        content: fileContent
      }
    };

    await octokit.gists.update({
      gist_id: inputs.gistId,
      files: updatedFiles
    });

    console.log('Gist updated successfully.');
  } catch (error) {
    console.log('Error updating gist:', error.message);
  }
}

module.exports = {
  checkGist,
  updateGist
};
