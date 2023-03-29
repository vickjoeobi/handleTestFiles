const fs = require('fs').promises;

async function validateRepoFileContent(inputs) {
  try {
    const fileContent = await fs.readFile(inputs.filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    const isValid = inputs.expectedTestDataArray.every(key => {
      return jsonData.hasOwnProperty(key) && jsonData[key].trim() !== '';
    });

    if (isValid) {
      console.log('The JSON file in the repo is valid.');
    } else {
      console.log('The JSON file in the repo is not valid or all the keys are either not present or correct.');
      throw new Error('Error The JSON file in the repo is not valid or all the keys are either not present or correct.');
    }

    return isValid;
  } catch (error) {
    console.log('Error validating repo file content:', error.message);
    throw new Error('Error validating repo file content: ' + error.message);
  }
}

module.exports = {
  validateRepoFileContent
};
