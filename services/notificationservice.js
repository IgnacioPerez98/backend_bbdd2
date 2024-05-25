let ws;

const handlerNotificaciones = require('../handlers/handlerNotificaciones')

const clients = new Map();
let WebSocket = {
    getWS : () => {
        return ws;
    },
    setWS : (wss) => {
        ws = wss;
    },
    /**
     * Nico tenes que enviar un json al conectarte: {"type": "identify", "ciUser", "el user id" }
     */
    wsCreateCon :  () => {
        WebSocket.getWS().on('connection', (ws) => {

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    handlerNotificaciones.handle(ws,data);
            } catch (error) {
                console.log('Error parsing message:', error);
            }
            });
            ws.on('close', async () => {
                console.log(`User ${ws.ciUser} disconnected`);
                clients.delete(ws.ciUser)
            });
        });
    },
    /**
     * Notifica a los usuarios a travez del WebSocket
     * @param {*} texto  Valor texto del mensaje a enviar
     * @param {*} id numero[] de cedulas del usuario
     */
    Notify: function (texto,id){
        try {
            ws.clients.forEach((client) => {
                if(id === undefined || id === null){
                    //no se define es un broadcast
                    client.send(texto);
                }else{
                    if(id === client.userId){
                        client.send(texto);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

}


module.exports = {WebSocket, clients};