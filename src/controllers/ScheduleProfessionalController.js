const connection = require('../database/connection');

module.exports = {

    async index(request, response) {
        const {idPeople, date} = request.body
        try{
            const schedules = await connection('Schedule')
            .where('Schedule.idProfessional', idPeople)
            .andWhere('Schedule.date', date)
            .join('People AS client', 'client.idPeople', '=', 'Schedule.idClient')
            .join('People AS professional', 'professional.idPeople', '=', 'Schedule.idProfessional')
            .select('Schedule.idSchedule',
            'Schedule.idProfessional',
            'professional.firstName as professionalName',
            'Schedule.idClient',
            'client.firstName as clientName', 
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
    }
}