

const errorMessagges = (status, errstring= "") => {

    switch(status){
        case 200:
            return { message: "Success", error : "None"};
        case 400:
            return { message: "The request don't have the correct format.", error : errstring};
        case 404:
            return { message: "The resourse was not found" , error: errstring};
        case 500:
            return { message: "Error 500", error : "Internal server error, try again."};
        default:
            return { message: "Error", error: errstring}  ;
    }

}

module.exports = errorMessagges;