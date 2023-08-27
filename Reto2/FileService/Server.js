const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');  // Import the fast-glob package

const PROTO_PATH = path.resolve(__dirname, '../proto/FileService.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const combinedProto = grpc.loadPackageDefinition(packageDefinition);

const DIRECTORY_PATH = path.join(__dirname, '../Files');
const HOST = '0.0.0.0:50051';

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

// Implementation for SearchFiles service using fast-glob
const searchFiles = (call, callback) => {
    const Name = call.request.name;
    fg(`${DIRECTORY_PATH}/${Name}*`)  // Use fast-glob to search for files
        .then(matchingFiles => {
            // Extract just the file names from the full paths
            const fileNames = matchingFiles.map(filePath => path.basename(filePath));
            callback(null, { searchResponse: fileNames });
        })
        .catch(err => {
            callback({
                code: grpc.status.INTERNAL,
                details: "Error reading directory"
            });
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
