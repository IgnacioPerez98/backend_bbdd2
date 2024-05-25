let wsocket;

const userHandler = require("../handlers/handlerUsers");

const clients = new Map();
let notification = {
    getWS : function()  {
        return wsocket;
    },
    setWS : function (wss) {
        wsocket = wss;
    },
    /**
     * Nico tenes que enviar un json al conectarte: {"type": "identify", "ciUser", "el user id" }
     */
    wsCreateCon :  () => {
        wsocket.on('connection', (ws) => {

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    switch (data.type){
                        case 'identify':
                            try{
                                // Store the WebSocket connection with the user ID
                                clients.set(data.ciUser, ws);
                                wsocket.userId = data.ciUser;
                                let user = await userHandler.signin(data.ciUser);
                                ws.userdata = user.data;
                                Notify(`Welcome ${user.data.username}`,null)
                            }catch(error){
                                console.error('Error en funcion notificacion: ',error);
                            }

                    }
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
            wsocket.clients.forEach((client) => {
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


module.exports = notification;