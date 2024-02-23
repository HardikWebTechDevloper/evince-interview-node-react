require('dotenv').config();

const cluster = require('cluster');
const constants = require('./config/constants');
const express = require('./config/server.config');
const { sequelize } = require('./models');

const PORT = process.env.PORT;
const APP_NAME = constants.APP_NAME;

const app = express();

if (cluster.isMaster) {
    var cpu = require('os').cpus();
    var cpuCount = cpu.length;
    for (var i = 0; i < cpuCount; i += 1) {
        if (i === 0) {
            // Database Connection
            (async () => {
                await sequelize.authenticate();
            })();
        }

        cluster.fork();
    }
    cluster.on('online', function (worker) {
        console.log(APP_NAME + ' System Worker ' + worker.process.pid + ' is online');
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log(APP_NAME + ' System Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log(APP_NAME + ' System worker');
        cluster.fork();
    });
} else {
    app.listen(PORT, async () => {
        console.log(APP_NAME + ` connected to port ${PORT}.`);
    });
}

module.exports = app;