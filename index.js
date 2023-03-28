const core = require('@actions/core');
const github = require('@actions/github');

{
    async () => {
        try {
            core.notice("Calling the action")
        } catch (error) {
            core.setFailed(error.message);
        }
    }
    
}();