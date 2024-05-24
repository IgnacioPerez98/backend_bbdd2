const e = require("express");
let ws;

let clients = new Map();
let WebSocket = {


    getWS : function (){
        return ws;
    },
    setWS : function (wss){
        ws = wss;
    },
    /**
     * Nico tenes que enviar un json al conectarte: {"type": "identify", "ciUser", "el user id" }
     */
    wsCreateCon : function (){
        this.getWS().on('connection', (ws) => {

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    if (data.type === 'identify') {
                        // Store the WebSocket connection with the user ID
                        clients.set(data.ciUser, ws);
                        ws.userId = data.ciUser;
                        console.log(`User ${data.ciUser} connected`);
                    } else {
                        console.log(`Received message from user ${ws.ciUser}: ${data.message}`);
                        // Handle other message types
                    }
            } catch (error) {
                console.log('Error parsing message:', error);
            }
            });
            ws.on('close', () => {
                console.log(`User ${ws.ciUser} disconnected`);
                clients.delete(ws.ciUser)
            });
        });
    },
    /**
     * Notifica a los usuarios a travez del WebSocket
     * @param {*} texto  Valor texto del mensaje a enviar
     * @param {*} id numero de cedla del usuario
     */
    Notify: function (texto,id){
        try {
            ws.clients.forEach((client) => {
                client.send(texto);
            });
        } catch (error) {
            console.log(error);
        }
    }

}


module.exports = WebSocket;