
const userHandler = require('../handlers/handlerUsers')
const handlerNot = require('../services/notificationservice')
let handlerNotificaciones = {
    handle : async (ws,data) => {
        switch(data.type){
            case 'identify':
                await saludar(ws,data)
                break
        }

    }
}
module.exports = handlerNotificaciones;


/**
 * 
 * @param {Saluda a un user, proporcionando el id} ws 
 * @param {*} data 
 */
const saludar = async (ws,data) => {
    try{
        // Store the WebSocket connection with the user ID
        handlerNot.clients.set(data.ciUser, ws);
        ws.userId = data.ciUser;
        let user = await userHandler.signin(data.ciUser);
        ws.userdata = user.data;
        handlerNot.WebSocket.Notify(`Welcome ${user.data.username}`)
    }catch(error){
        console.error('Error en funcion saludar.NotifcacionesHandler: ',error);
    }
}


const notificar_partido = async (ws,data) => {

}

