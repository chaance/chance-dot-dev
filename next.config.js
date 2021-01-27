const path = require("path");
module.exports = {
	sassOptions: {
		includePaths: [path.join(__dirname, "src/styles")],
	},
	//target: "serverless",
	target: "experimental-serverless-trace",
};
