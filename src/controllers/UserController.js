const connection = require('../database/connection');
const sendEmail = require('../middleware/sendEmail');
const generatePass = require('../utils/generatePass');

module.exports = {

    
    async index(request, response) {
        const cpfStore = request.headers.authorization;

        const users = await connection('Users')
        .where('cpf_People', cpfStore)
            .select('*');        
        
        if(!users){
            return response.status(400).json({warning : "Nenhum usuário cadastrado ainda"});            
        }
        else{
            return response.status(200).json(users);
        }
    },
    
    async create(request, response) {
        const {email, idPeople} = request.body;
        try {
            const usersValidation = await connection('Users').select('*')
            .where('email', email).first();
            
            if(!usersValidation){
                 
                const password = generatePass();
                const data = {
                    email, 
                    password,
                    typeUser : 'cliente',
                    idPeople
                }
                data;                
                await connection('users').insert(data);

                const customerShippingData = { passRender : password, email : email};
                const res = await sendEmail.sendEmail(customerShippingData)
                if(res !== '')
                    return response.status(200).send({sucess: `Usuário criado com sucesso. Senha padão enviada para o email informado`});
            }
            else{
                return response.status(400).send({ warning: "Usuário já existe. Favor recuperar senha."});
            }
        }
        catch (err){
            return response.status(500).send({error: err});
        }

    },

    async update(request, response) {
        const {idUser, email, active, typeUser, nameUser} = request.body;
        try{
            
            const act = active.trim();
            
            await connection('Users').update({
                email,
                active: act,
                typeUser,
                nameUser
            }).where('idUser', idUser);
            
            return response.json({sucess: "Atualização efetuada com sucesso"}); //quebra galho
        }
        catch (err){
            return response.status(500).json( {error: err});
        }
    }

}