exports.init = function(io, app) {
    io.on('connection', function(socket) {
        try {
            socket.on('custom-message', function(message, param) {
                socket.emit('custom-message', message, param);
            });
        } catch(e) {
            console.log(e);
        }
    });
}