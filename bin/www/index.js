const app = require('../../server');
const { server_env_variables } = require('../../configs/configVariables');
const port = server_env_variables.port || 4000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
