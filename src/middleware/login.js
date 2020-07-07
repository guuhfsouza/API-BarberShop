const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {
        const decode = jwt.decode(request.headers.token, request.body.cpfStore);
        request.usuario = decode;
        if(decode)
            next();
        else
        return response.status(401).send({error: 'Falha na autenticação'});
    } catch (error) {
        return response.status(401).send({error: 'Falha na autenticação'});
    }
}