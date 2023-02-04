const { API } = require('easy-api.ts');
const colors = require('colors/safe');

const api = new API({
    port: 55621,
    database: {
       enabled: true,
        type: 'default'
    }
});

//Route loader
api.routes.load('./endpoints').then(() => {
  console.log('| All Endpoints Loaded!\n|-------------------------------------------------------|\n| API Made by ZTRdiamond\n╰──────────────────────・');
  api.connect()
});