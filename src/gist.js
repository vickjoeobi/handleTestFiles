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
      throw new Error('Error checking gist ID and initial File: ' + error.message);
    }
  } catch (error) {
    console.log('Error checking gist:', error.message);
    throw new Error('Error checking gist: ' + error.message);
  }
}

async function updateGist(inputs) {
    const octokit = new Octokit({ auth: inputs.token });
  
    try {
      // Get the initial file content from the gist
      const gist = await octokit.gists.get({ gist_id: inputs.gistId });
      const initialFileContent = gist.data.files[inputs.initialFilename].content;
      const initialFileData = JSON.parse(initialFileContent);
  
      // Get the repo file content
      const repoFileContent = await fs.readFile(inputs.filePath, 'utf-8');
      const repoFileData = JSON.parse(repoFileContent);
  
      // Combine the initial file data with the repo file data
      const combinedData = { ...initialFileData, ...repoFileData };
  
      // Update the gist with the combined data in the final file
      const updatedFiles = {
        [inputs.finalFilename]: {
          content: JSON.stringify(combinedData, null, 2)
        }
      };
  
      await octokit.gists.update({
        gist_id: inputs.gistId,
        files: updatedFiles
      });
  
      console.log('Gist updated successfully.');
    } catch (error) {
      console.log('Error updating gist:', error.message);
      throw new Error('Error updating gist: ' + error.message);
    }
  }
  

module.exports = {
  checkGist,
  updateGist
};
