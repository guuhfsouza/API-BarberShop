const connection = require('../database/connection');

module.exports = {
    
    async index (request, response){
        const {idPeople, email} = request.body;
    
        try{
            const profile = await connection('People')
            .select('*')
            .where('email', email)
       //     .orWhere('idPeople', idPeople)
            .first();

            if(!profile ){
                return response.status(400).send({error: "Dados ainda não cadastrados."})
            }

            return response.json(profile);

        }catch (err){
            return response.status(500).send({error: err})
        }
    },

    async create(request, response) {
        const {firstName, lastName, cel, email, tipeProfile} = request.body;

        try{

            //construção da data
            const date = new Date();
            const created_at = date.getDate() + '/' +
            (date.getMonth()+1).toString() + '/' + date.getFullYear();
        
            let profileValidation = await connection('People').
            select('*').where('email', email + "2").first();
                       

            if(!profileValidation){

                const returnRequestDB = await connection('People')
                .insert({
                    firstName,
                    lastName,           
                    cel, 
                    email, 
                    tipeProfile,
                    created_at  
                }).returning('idPeople');

                return response.status(200).json({sucess: "Dados salvos com sucesso.",
                 idPeople: returnRequestDB[0]});
            }
            else{
                return response.status(400).send({alert: "Dados já cadastrados."});
            }
        }
        catch (err){
            return response.status(500).send({error: err});
        }

    },

    async update(request, response){
        const idPeople = request.query.idPeople;
        try{
            
            const velidationDatas = this.index(request)
            if(!velidationDatas){
                return response.status(400).send({message: 'Esse cadastro não foi encontrado'});
            }

            await connection('People')
            .update({
                firstName, 
                lastName, 
                phone, 
                email, 
            })
            .where('idPeople', idPeople);

            return response.send({ sucess: "Dados atualizados com sucesso"});
        }
        catch (err){
            return response.status(500).send({ error: err});
        }

    }
}
