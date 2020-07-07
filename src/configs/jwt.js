const jwt = require('jsonwebtoken');

exports.sign = (users) => {
    const token = jwt.sign({
        idUser: users.idUser,
        email: users.email,
    }, 
    String(users.cpf_People),
    {
        expiresIn: 1440
    });

    return token;

}