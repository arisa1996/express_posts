const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Meta API",
        description: "範例生成文件"
    },
    // 上 heroku 要調
    host: "localhost:3000",
    schemes: ['http', 'https']
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)