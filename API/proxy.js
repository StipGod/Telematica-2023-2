const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const app = express();
const PORT = 3000;

// file service 
const listFileProtoPATH = path.resolve(__dirname, '../proto/ListFiles.proto');
const listFilePORT = 50000;
const listFilePackageDefinition = protoLoader.loadSync(listFileProtoPATH);
const listFileService = grpc.loadPackageDefinition(listFilePackageDefinition).FileService;
const listFileClient = new listFileService(`127.0.0.1:${listFilePORT}`,grpc.credentials.createInsecure());

// search service
const searchFileProtoPATH = path.resolve(__dirname, '../proto/SearchFiles.proto');
const searchFilePORT = 50001;
const searchFilePackageDefinition = protoLoader.loadSync(searchFileProtoPATH);
const searchFileService = grpc.loadPackageDefinition(searchFilePackageDefinition).FileService;
const searchFileClient = new searchFileService(`127.0.0.1:${searchFilePORT}`,grpc.credentials.createInsecure());

// list all files endpoint
app.get('/list', (req, res) => {
  listFileClient.ListFiles({}, (error, response) => {
    if (error) {
        console.error('Error calling the List gRPC service', error);
        res.status(500).send('Error calling microservice');
        return;
    }
    res.json(response.filenames);
  });
});

// search file 
app.get('/search', (req, res) => {
    searchFileClient.SearchFiles({ name: req.query.name }, (error, response) => {
      if (error) {
        console.error('Error calling the Search gRPC service', error);
        res.status(500).send('Error calling microservice');
        return;
      }
      res.json(response);
    });
  });
  
  
  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});