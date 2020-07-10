// Update with your config settings.

module.exports = {

  development: {
    client: 'mssql',
    connection: {

      //#region concexão local
      host : 'localhost\\SQLEXPRESS', //conexão localhost
      port: '1433', //porta localhost
      user : 'sa',
      password : 'sasecuritypassword',
      database : 'BarberShop',
      //#endregion
      
      //#region conexão externa
      // server: 'den1.mssql8.gear.host',
      // user: 'agendaonline1',
      // password: '',
      // database : '',
      //#endregion
      options: {    
          enableArithAbort: true
      }
    },
    migrations: {
      directory: './src/database/migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mssql',
    connection: {
      server: 'den1.mssql8.gear.host',
       user : 'agendaonline1',
       password : 'san230864dra.',
      database : 'agendaonline1',
      options: {    
          enableArithAbort: true
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations'
    }
  }

};
