const http = require('http');
const socketIo = require('socket.io');

require('http-shutdown').extend();

const server = http.createServer().withShutdown();

const exitHandler = function exitHandler(message) {
    return function handle () {
        console.log(typeof message === 'function' ? message(...arguments) : message);
        server.shutdown(function exit () {console.log('Shutdown');});
    };
};

process.on('SIGINT', exitHandler('SIGINT signal'));
process.on('SIGTERM', exitHandler('SIGTERM signal'));
process.on('exit', exitHandler(function exit(code) {return 'Exit code: ' + code;}));

function start(app) {
    console.log('server start');

    server.on('request', app);
    server.on('error', function onError(error) {
        console.error('Error!');
        console.error(error);
        process.exit(1);
    });
    server.on('listening', () => {console.log('listening ' + server.address().port);});

    server.listen(process.env.NODE_PORT || 8888);

    if (app.ws) {
        console.log('ws server start');

        const ws = socketIo(server);

        ws.on('connection', function (socket) {
            console.log('WS connected');

            app.ws(socket);
        });
    }
}

module.exports.server = server;
module.exports.start = start;
