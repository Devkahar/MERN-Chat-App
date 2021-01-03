const WebSocket = require('ws');
const {payloadprocressMessage} = require('./utilities');


exports.setupWebSocketServer = ()=>{
    const wss = new WebSocket.Server({
        port:2001
    })
    wss.on('connection',function connection(ws){
        // a single client connection
        ws.on('message',function incoming(payload){
            const message = payloadprocressMessage(payload.toString())
            if(!message){
                return;
            }

            return ws.send(JSON.stringify(message));
        })
        ws.send('something');
    })
}