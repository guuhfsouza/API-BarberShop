const connection = require('../database/connection');

module.exports = {

    async index(request, response) {
        const cpfStore = request.headers.authorization;
        const date = request.headers.date;
        try{
            const schedules = await connection('Schedule')
            .where('Schedule.cpfStore', cpfStore)
            .andWhere('Schedule.date', date)
            .join('Service', 'Service.idService', '=', 'Schedule.idService')
            .join('Users', 'Users.idUser', '=', 'Schedule.idUser')
            .select('Schedule.idSchedule ', 
            'Schedule.client', 'Service.service',
            'Schedule.date', 'Schedule.status', 'Service.price', 'Users.nameUser')

            if(!schedules){
                return response.json({ warning: 'Sem agenda para a data.'})                
            }

            return response.json(schedules);
        }catch (err) {
            return response.status(500).json({error: err})
        } 
    },

    async create(request, response) {
        const { idService, client, date, status, cpfStore, idUser, hour} = request.body;

        const validateSchedule = await connection('Schedule').
        select("*").where('idUser', idUser).andWhere('date', date).andWhere('hour', hour).first();

        if(validateSchedule)
            return response.json({ warning: "O horário já está preenchido. Encontre outro horário"});

        try{
             await connection('Schedule')
            .insert({
                idService,
                client,
                date,
                status,
                cpfStore,
                idUser,
                hour
            })

            return response.json({ sucess: `Horário do dia ${date} as ${hour} agendado com sucesso para o Sr(a) ${client}`});
    
        }
        catch (err){
            return response.status(500).json({ error: err})
        }
    },

    async update(request, response) {
        const cpfStore = request.headers.authorization;
        const { idSchedule, idService, client, date, status} = request.body;
        
        try{

            const scheduleValidation = await connection('Schedule')
            .select('cpfStore')
            .where('idSchedule', idSchedule)
            .first(0);


            if(scheduleValidation.cpfStore !== cpfStore){
                return response.status(400).json({ warning: 'Sem autorização para alteração da agenda.'})
            }

            await connection('Schedule')
            .where('idSchedule', idSchedule)
            .update({
                idService,
                client,
                date,
                status,
            })

            return response.json({ sucess: 'Agenda ataulizada com sucesso.'})

        }catch (err) {
            return response.status(500).json({ error: err})
        }

    }

}