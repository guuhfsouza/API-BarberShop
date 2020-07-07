const connection = require('../database/connection');
const jwt = require('../configs/jwt');


module.exports = {
    async index(request, response) {
        const email = request.headers.email;
        const password = request.headers.password;

        const users = await connection('Users')
        .select('idUser', 'email', 'typeUser')
        .where('email', email)
        .andWhere('password', password)
        .first();
        
        if(!users){
            return response.status(400).send({error : 'Usuário e senha inválidos.'});            
        }
        else{
            const token = jwt.sign(users);           
            return response.status(200).json({users, "token": token});

        }
    },

    async update(request, response){
        const {email, password} = request.body;

        const getUser =  await connection('Users')
        .select('*')
        .where('email', email)
        .first();

        if(getUSer)
                return response.status(400).json({ warning: "E-mail não cadastrado em nossa base."});

        await connection('Users')
        .update({
            password
        })
        .where('email', email);
        
        return response.status(200).json({sucess: "Senha atualizada com sucesso."});
    }
}
