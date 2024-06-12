const userHandler = require("../handlers/handlerUsers");
const schedule = require('node-schedule')
const handlerMatches = require('../handlers/handlerMatches')
const handlerPredicciones = require('../handlers/handlerPredictions')


let wsocket;

/**
 * Clientes es un amp de ci, al ws de cada miembre.
 * Se añaden propiedades al objeto:
 *      userdata => cada propiedad que se almacena en la tabla usuarios
 *      
 */
const clients = new Map();

const wsCreateCon = async () => {
    wsocket.on('connection', (ws) => {

        ws.on('message', async (message) => {
            try {
                const {type, ci} = JSON.parse(message);
                switch (type){
                    case 'identify':
                        try{
                            // Store the WebSocket connection with the user ID
                            let user = await userHandler.signin(ci);
                            if(user.status === 200){
                                ws.userdata = user.data;
                                clients.set(ci, ws);
                                Notify(`Bienvenido ${user.data.username}`, ci)
                            }
                        }catch(error){
                            console.error('Error en funcion notificacion: ',error);
                        }

                }
        } catch (error) {
            console.log('Error parsing message:', error);
        }
        });
        ws.on('close', async () => {
            console.log(`User ${ws.ci} disconnected`);
            clients.delete(ws.ci)
        });
    });
}
const getWS = () =>{
    return wsocket;
}
const setWS = (wss) =>{
    wsocket = wss;
}

/**
 * Envia una notiificacion a treavez de un  web socket
 * @param {*} texto 
 * @param {*} id es un id que corresponde a la cedula de un cliente.
 */
const Notify = (texto, id,eventType) =>{
    try { 
        if(id === undefined || id === null){
        //no se define es un broadcast
        wsocket.send(texto);
        }else{
            let wscliente = clients.get(id);
            if(wscliente !== undefined){
                wscliente.send(JSON.stringify({
                    eventType: eventType===undefined?`Notification`:`${eventType}`,
                    message: `${texto}`
                }))
            }
        }
    } catch (error) {
        console.log("Error on Notify function: ",error);
    }
}

const scheduleMatchNotification = async () =>{
    try {
        let partidos = await handlerMatches.getMatchandDate();
        if(partidos.status === 200){
            let {matches} = partidos;
            matches.forEach( (partido) => {
                let horaPartido = new Date(Date.parse(partido.fecha))//aca hay cagada
                horaPartido = horaPartido.setHours(horaPartido.getHours() - 1);
                let mensaje = "";
                if(partido.id <25){
                    mensaje = `No te pierdas el partido de ${partido.equipo1} vs ${partido.equipo2}, a las ${horaPartido.toString()}`;
                }else if (partido.id >24 && partido.id <29){
                    //cuartos
                    mensaje = `En una hora comienzan los cuartos de final.`;
                }else if (partido.id > 28 && partido.id <31 ){
                    //semis
                    mensaje = `En una hora comienzas las semifinales.`;
                }else if( partido.id === 31 ){
                    //tercer Puesrto
                    mensaje = `En una hora comienza el partido por el tercer puesto.`;
                }else{
                    //final
                    mensaje = `En una hora comienza la gran final!!!! No te la pierdas!!!`;
                }
                schedule.scheduleJob(`Notificacion Partido ${partido.id}`, horaPartido, async () => {
                    //Notifico a broadcast al channel
                    Notify(mensaje, null);
                    //Notifico el array de usuarios que pusieron una prediccion
                    await notifyNotPrediction(partido.id);
                })
            })
        }else{
            console.error("Error getting the matches: ",partidos.error)
        }

    }catch (error){
        console.error("Error on match schedule: ",error)
    }
}

const notifyNotPrediction = async (id_partido) => {
    try{
        let res = await handlerPredicciones.getIdsWithoutResult(id_partido);
        if(res.status!== 200){
            console.error("Error getting notification")
        }else{
            let {data} = res;
            Notify(`Las predicciones estan por cerrar, no olvides ingresar la tuya.`,data)
        }

    }catch(error){
        console.error("Error getting notification")
    }
}

module.exports = {getWS, setWS,Notify, wsCreateCon,scheduleMatchNotification};