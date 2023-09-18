const fs = require("fs");

//main config
global.port = 3000
global.sessionKeys = ['Jbf*h3x7#¥abe','Udb3&8Gw+7rh#fiU','UdIebz8V3j*ave8U2v']

//error msg
global.errMsg = {
	disable: { status: 406, error: 'The route is in disable mode!' },
	invalidApikey: { status: 401, error: 'Invalid apikey' },
	nullApikey: { status: 401, error: 'Apikey is required to access this endpoint!' },
	limitReached: { status: 401, error: 'The request limit in your account has been reached, the limit will be reset after 24 hours' },
	userUndefined: { status: 401, error: 'Unauthorized request, user was undefined' }
}

global.ig = {
    username: "zanixon.group",
    password: "zanixongrouptm2022"
}

global.creator = {
    name: "ZTRdiamond",
    github: "https://github.com/ZTRdiamond"
}