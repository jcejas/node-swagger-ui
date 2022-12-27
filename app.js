require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;

const getEntrypoint = (basePath, maxPaths) => {
	for (let i = 1; i <= maxPaths; i++) {
		basePath += `/:path_${i}?`
	}
	return basePath;
}

let options = {
	swaggerOptions: {
		url: `http://localhost:${port}/swagger-files/${process.env.SWAGGER_FOLDER}/${process.env.SWAGGER_BASE_FILE_YAML}`
	}
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

app.use(getEntrypoint('/swagger-files', process.env.MAX_PATHS), (req, res) => {
	
	res.setHeader('Content-Type', 'text/yaml');
	res.status(200);
	try {
		let path = `${process.env.SWAGGER_PATH}`

		//Set Dynamic Path
		for (let i = 1; i <= process.env.MAX_PATHS; i++) {

			if (typeof req.params[`path_${i}`] != 'undefined') {
				path += `/${req.params[`path_${i}`]}`
			}
		}
		console.log('Path -->', path)

		let data = fs.readFileSync(path)
		res.end(data);
	} catch (error) {
		console.error(error.message);
		res.end('');
	}
});

app.listen(port, function () {
	console.log(`SwaggerUI ready in http://localhost:${port}/api-docs`);
});