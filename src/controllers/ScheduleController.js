const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const {idPeople, date} = request.body
        try{
            const schedules = await connection('Schedule')
            .where('Schedule.idClient', idPeople)
            .andWhere('Schedule.date', date)
            .join('People AS client', 'client.idPeople', '=', 'Schedule.idClient')
            .join('People AS professional', 'professional.idPeople', '=', 'Schedule.idProfessional')
            .select('Schedule.idSchedule', 
            'Schedule.idProfessional', 
            'professional.firstName AS professionalName',
            'Schedule.idClient',
            'client.firstName AS clientName', 
            'Schedule.date',
            'Schedule.hour'
            )

            if(!schedules){
                return response.send({ warning: 'Sem agenda para a data.'})                
            }

            return response.json(schedules);
        }catch (err) {
            return response.status(500).send({error: err})
        } 
    },

    async create(request, response) {
        const { idClient, idProfessional, date, hour} = request.body;
    
        const validateSchedule = await connection('Schedule').
        select("*").where('idClient', idClient).orWhere('idProfessional', idProfessional)
        .andWhere('date', date).andWhere('hour', hour).first();

       if(validateSchedule)
            return response.send({ warning: "O horário já está preenchido. Encontre outro horário"});
        

        try{
             await connection('Schedule')
            .insert({
                idProfessional,
                idClient,
                date,
                hour
            });

            return response.send({ sucess: `Horário do dia ${date} as ${hour} agendado com sucesso.`});
    
        }
        catch (err){
            return response.status(500).send({ error: err})
        }
    },

    async update(request, response) {
        const { idSchedule, idProfessional, idClient, date, hour} = request.body;
        
        try{

            const scheduleAndProfessonalValidation = await connection('Schedule')
            .select('idProfessional', 'idClient')
            .where('idSchedule', idSchedule)
            .first();

            if(scheduleAndProfessonalValidation.idProfessional !== idProfessional || 
                scheduleAndProfessonalValidation.idClient !== idClient){
                return response.status(400).send({ warning: 'Sem autorização para alteração da agenda.'})
            }

            await connection('Schedule')
            .where('idSchedule', idSchedule)
            .update({
                idProfessional,
                idClient,
                date,
                hour,
            })

            return response.json({ sucess: 'Agenda ataulizada com sucesso.'})

        }catch (err) {
            return response.status(500).json({ error: err})
        }

    }

}