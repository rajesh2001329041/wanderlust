const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

const swaggerFolder =path.join(__dirname,'swagger');  // your swagger YAML folder

// Get all .yaml files in the folder except index.js
const yamlFiles = fs.readdirSync(swaggerFolder).filter(f => f.endsWith('.yaml'));

let mergedPaths = {};
let mergedComponents = {};

yamlFiles.forEach(file => {
  const fullPath = path.join(swaggerFolder, file);
  const doc = YAML.load(fullPath);

  if (doc.paths) {
    mergedPaths = { ...mergedPaths, ...doc.paths };
  }
  if (doc.components) {
    mergedComponents = { ...mergedComponents, ...doc.components };
  }
});

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Modular Swagger API',
    version: '1.0.0',
    description: 'Swagger doc merged from multiple YAML files'
  },
  servers: [{ url: 'http://localhost:3030' }],
  paths: mergedPaths,
  components: mergedComponents
};

module.exports = swaggerDocument;
