const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const app = express();
const PORT = 3000;

const serviceProtoPATH = path.resolve(__dirname, '../proto/FileService.proto');
const serviceServicePORT = 50000; 
const servicePackageDefinition = protoLoader.loadSync(serviceProtoPATH);
const serviceService = grpc.loadPackageDefinition(servicePackageDefinition).FileService;
const serviceClient = new serviceService(`127.0.0.1:${serviceServicePORT}`, grpc.credentials.createInsecure());

// List files endpoint
app.get('/list', (req, res) => {
  serviceClient.ListFiles({}, (error, response) => {
    if (error) {
        console.error('Error calling the List gRPC service', error);
        res.status(500).send('Error calling microservice');
        return;
    }
    res.json(response.filenames);
  });
});

// Search file endpoint
app.get('/search', (req, res) => {
    serviceClient.SearchFiles({ name: req.query.name }, (error, response) => {
      if (error) {
        console.error('Error calling the Search gRPC service', error);
        res.status(500).send('Error calling microservice');
        return;
      }
      res.json(response.searchResponse);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
