const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

const PROTO_PATH = path.resolve(__dirname, '../proto/FileService.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const combinedProto = grpc.loadPackageDefinition(packageDefinition);

const DIRECTORY_PATH = path.join(__dirname, '../Files');
const HOST = 'localhost:50000';

const server = new grpc.Server();

// Implementation for ListFiles service
const listFiles = (call, callback) => {
    fs.readdir(DIRECTORY_PATH, (err, files) => {
        if (err) {
            callback({
                code: grpc.status.INTERNAL,
                details: "Error reading directory"
            });
            return;
        }
        callback(null, { filenames: files });
    });
};

// Implementation for SearchFiles service
const searchFiles = (call, callback) => {
    fs.readdir(DIRECTORY_PATH, (err, files) => {
        const Name = call.request.name;
        if (err) {
            callback({
                code: grpc.status.INTERNAL,
                details: "Error reading directory"
            });
            return;
        }

        const matchingFiles = files.filter(file => file.startsWith(Name));
        callback(null, { searchResponse: matchingFiles });
    });
};

// Add both services to the server
server.addService(combinedProto.FileService.service, { 
    ListFiles: listFiles,
    SearchFiles: searchFiles 
});

server.bindAsync(HOST, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`Listening on port ${HOST}`);
});
