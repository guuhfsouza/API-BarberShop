const connection = require('../database/connection');
//const generatePass = require('../utils/generatePass');

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
        const { cpf_People, email, password, active, typeUser, nameUser} = request.body;
        

        try {
            const usersValidation = await connection('Users').select('*')
            .where(
                'email', email)
                .andWhere('cpf_People', cpf_People)
                .first();
            
            if(!usersValidation){
                 
                const date = new Date();
                const created_At = date.getDate() + '/' +
                (date.getMonth()+1).toString() + '/' + date.getFullYear();
                


//                const pass = generatePass();
                await connection('Users').insert({
                    cpf_People,
                    email, 
                    password,
                    created_At,
                    active,
                    typeUser,
                    nameUser
                });

            return response.json({sucess: "Usuário criado com sucesso. Realize a recuperção de senha"}); //quebra galho
            }
            else{
                return response.json({ warning: "Usuário já existe para sua loja. Favor recuperar senha."});
            }
        }
        catch (err){
            return response.status(500).json({error: err});
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