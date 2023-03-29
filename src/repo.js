const { Octokit } = require('@octokit/rest');

async function checkFileExistence(inputs) {
    const octokit = new Octokit({ auth: inputs.token });
  
    try {
      const { data: repoContent } = await octokit.repos.getContent({
        owner: inputs.username,
        repo: inputs.repo,
        path: inputs.filePath
      });
  
      console.log('Owner:', inputs.username);
      console.log('Repo:', inputs.repo);
      console.log('Path:', inputs.filePath);

      //use core.notice to print out the full repo path
      core.notice('Owner:', inputs.username);
        core.notice('Repo:', inputs.repo);
        core.notice('Path:', inputs.filePath);
  
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
      return false;
    }
  }
  

module.exports = {
  checkFileExistence
};
