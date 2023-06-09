const { Octokit } = require('@octokit/rest');
const core = require('@actions/core');

async function checkFileExistence(inputs) {
    const octokit = new Octokit({ auth: inputs.token });
  
    try {
      const { data: repoContent } = await octokit.repos.getContent({
        owner: inputs.username,
        repo: inputs.repo,
        path: inputs.filePath,
        ref: 'main'   
      });
  
      console.log('Owner:', inputs.username);
      console.log('Repo:', inputs.repo);
      console.log('Path:', inputs.filePath);



  
      if (repoContent && repoContent.type === 'file') {
        console.log('The JSON file exists in the repo.');
        return true;
      } else {
        console.log('The JSON file does not exist in the repo.');
        return false;
      }
    } catch (error) {
      console.log('Error checking file existence in repo:', error.message);
      console.log('Owner:', inputs.username);
      console.log('Repo:', inputs.repo);
      console.log('Path:', inputs.filePath);
      throw new Error('Error checking file existence in repo: ' + error.message);
    }
  }
  

module.exports = {
  checkFileExistence
};
