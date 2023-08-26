const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = 80;

const serviceProtoPATH = path.resolve(__dirname, '../proto/FileService.proto');
const serviceServicePORT = 50051;
const servicePackageDefinition = protoLoader.loadSync(serviceProtoPATH);
const serviceService = grpc.loadPackageDefinition(servicePackageDefinition).FileService;
const serviceClient = new serviceService(`127.0.0.1:${serviceServicePORT}`, grpc.credentials.createInsecure());

function sendToQueue(msg) {
    amqp.connect('amqp://user:password@172.17.0.2', (error0, connection) => {
        if (error0) {
            console.error("Failed to connect to RabbitMQ", error0);
            return;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                console.error("Failed to create a channel", error1);
                return;
            }
            const queue = 'my_app';
            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });
    });
}

// List files endpoint
app.get('/list', (req, res) => {
    serviceClient.ListFiles({}, (error, response) => {
        if (error) {
            console.error('Error calling the List gRPC service', error);
            sendToQueue("List");
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
            sendToQueue('Search/' + req.query.name);
            res.status(500).send('Error calling microservice');
            return;
        }
        res.json(response.searchResponse);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
