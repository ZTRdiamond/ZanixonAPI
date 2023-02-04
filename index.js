const { API } = require('easy-api.ts');
const colors = require('colors/safe');

const api = new API({
    port: 5660,
    database: {
       enabled: true,
        type: 'default'
    }
});
api.db.path = '/database/tables/main.json'
//Route loader
api.routes.load('./endpoints').then(() => {
  console.log('All endpoints loaded!');
  api.connect()
});