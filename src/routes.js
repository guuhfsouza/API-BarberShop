const express = require('express');

const UserController = require('./controllers/UserController');
const PeopleController = require('./controllers/PeopleController');
const ScheduleController = require('./controllers/ScheduleController');
const ScheduleProfessionalController = require('./controllers/ScheduleProfessionalController');
const AuthenticationUser = require('./controllers/AuthenticationUser');

const login = require('./middleware/login');

const routes = express.Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.create);
routes.put('/users', login, UserController.update);

routes.get('/people', PeopleController.index);
routes.post('/people', login, PeopleController.create);
routes.put('/people', login, PeopleController.update);

routes.get('/schedules', login, ScheduleController.index);
routes.post('/schedules', login, ScheduleController.create);
routes.put('/schedules', login, ScheduleController.update);

routes.get('/schedulesProfessional', login, ScheduleProfessionalController.index);

routes.get('/authentication', AuthenticationUser.index);
routes.put('/authentication', AuthenticationUser.update);

module.exports = routes;