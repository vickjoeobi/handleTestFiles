const { Octokit } = require('@octokit/rest');

async function checkFileExistence(inputs) {
  const octokit = new Octokit({ auth: inputs.token });

  try {
    const { data: repoContent } = await octokit.repos.getContent({
      owner: inputs.username,
      repo: inputs.repo,
      path: inputs.filePath
    });

    if (repoContent && repoContent.type === 'file') {
      console.log('The JSON file exists in the repo.');
      return true;
    } else {
      console.log('The JSON file does not exist in the repo.');
      return false;
    }
  } catch (error) {
    console.log('Error checking file existence in repo:', error.message);
    return false;
  }
}

module.exports = {
  checkFileExistence
};
