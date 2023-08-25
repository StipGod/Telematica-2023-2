const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

const PROTO_PATH = path.resolve(__dirname, '../proto/SearchFiles.proto'); 
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const fileServiceProto = grpc.loadPackageDefinition(packageDefinition);

const DIRECTORY_PATH = path.join(__dirname, '../Files');
const HOST = 'localhost:50001';

const server = new grpc.Server();

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

server.addService(fileServiceProto.FileService.service, { SearchFiles: searchFiles });
server.bindAsync(HOST, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`Listening on port ${HOST}`);
});
