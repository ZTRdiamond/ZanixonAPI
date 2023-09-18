const db = require("./db.js");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const moment = require("moment-timezone");

db.storage({
	"account":"./database/account.json",
	"apikey":"./database/apikey.json",
	"cooldown":"./database/cooldown.json"
});

db.variable({
    totalRequest: 19,
    todayRequest: 0,
    weekRequest: 0,
    monthRequest: 0,
    limit: 2000
})

db.variable({
    cd: 0
}, "cooldown")

db.variable({
    totalUserRegister:0,
}, "account")

module.exports = {
	randomString: function randString() {
		let length = 18;
		const raw = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    let string = '';
		for (let i = 0; i < length; i++) {
		  const randomIndex = Math.floor(Math.random() * raw.length);
		  string += raw.charAt(randomIndex);
		}
	    return string;
	},
	increaseRequest: function incReq() { 
	    db.set("totalRequest", db.get("totalRequest") + 1, null, 'default', false)
	    return db.get("totalRequest");
	},
	clock: function clock() {
		const waktu = moment().tz("Asia/Jakarta").format("HH:mm:ss");
		return `${waktu}`;
	},
rateLimit: function rateLimit(id, type, duration, key) {
    const cdb = "cooldown";
    const currentTime = Math.floor(Date.now() / 1000);
    const routeTime = db.getVar("cd", id, null, cdb, false);
    const userTime = db.getVar("cd", key, null, cdb, false);

    if (type === "route" && routeTime >= currentTime) {
        const s = routeTime - currentTime;
        const sec = s % 60;
        const min = Math.floor((s % 3600) / 60);
        const hou = Math.floor(s / 3600);
        return { cooldown: true, duration: duration, time: `${hou}h ${min}m ${sec}s`, timestamp: routeTime };
    } else if (type === "user" && userTime >= currentTime) {
        const s = userTime - currentTime;
        const sec = s % 60;
        const min = Math.floor((s % 3600) / 60);
        const hou = Math.floor(s / 3600);
        return { cooldown: true, duration: duration, time: `${hou}h ${min}m ${sec}s`, timestamp: userTime };
    }

    if (type === "route" && routeTime < currentTime) {
        db.setVar("cd", Math.floor(currentTime + duration), id, null, cdb, false);
        return { cooldown: false };
    } else if (type === "user" && userTime < currentTime) {
        db.setVar("cd", Math.floor(currentTime + duration), key, null, cdb, false);
        return { cooldown: false };
    }
    return { cooldown: true };
},
	resetLimitTime: function resetwaitingtime(username) {
	    const resetTime = db.get("resetLimitTime", username, 'account', false);
	    const currentTime = Math.floor(Date.now() / 1000);
	    
	    if(currentTime > resetTime) {
	        return `Reset limit in: 0h 0m 0s`;
	    }
	    
	    const s = resetTime - currentTime;
	    const sec = s % 60;
	    const min = Math.floor((s % 3600) / 60);
	    const hou = Math.floor(s / 3600);
	    
	    return `Reset limit in: ${hou}h ${min}m ${sec}s`
	},
    resetLimit: function resetLimit(username) {
        const currentTime = Math.floor(Date.now() / 1000);
        const userResetTime = db.get("resetLimitTime", username, 'account', false);
        const userResetCooldown = db.get("resetLimitCooldown", username, 'account', false) || false;
        const userLimit = db.get("limit", username, 'account', false);
        const resetTime = Math.floor(currentTime + 10/*86400*/);

        if (userResetTime === 0 && userLimit === 0) {
            db.set("resetLimitTime", resetTime, username, "account", true);
            db.set("resetLimitCooldown", true, username, "account", true);
            return;
        }
    
        if (currentTime >= userResetTime) {
            db.set("limit", 2000, username, "account", true);
            db.set("resetLimitTime", 0, username, "account", true);
            return;
        }
    },
	signup: function signup(username, password, email) {
	    let apikey = this.randomString();
	    let userReg = db.get("totalUserRegister", null, "account", false);
	    let userRegp = userReg + 1;
		try {
			db.set(username, { premium: false, email: email, password: password, apikey: apikey, limit: 2000, resetLimitTime: 0, resetLimitCooldown: false, totalRequest: 0 }, null, "account", false);
			db.set(apikey, { username: username }, null, 'apikey', false);
			db.set("totalUserRegister", userRegp, null, "account", true);
			return true;
		} catch (err) {
			return false;
		}
	},
    isRegistered: function isRegist(username, email) {
       const databasePath = path.resolve(__dirname, '../database/account.json');
       const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
   
       for (const entry of Object.values(database)) {
         if (entry.username === username || entry.email === email) {
             return true;
          }
       }
       return false;
    },
	isSignin: function isLogin(username) {
		if(!username) {
			return true;
		} else {
			return false;
		}
	},
	isValidApikey: function isKey(username, key) {
	    const acc = db.get('apikey', username, "account", false);
	    //return acc;
	    if(acc == key) {
			return true;
		} else {
		    return false;
		}
	},
	createApikey: function cKey(key, prem, limit) {
		if(key != undefined && prem != undefined && limit != undefined) {
			console.error('createApikey: key, prem or limit can\'t be undefined')
			return;
		}
		if(isNaN(limit) == false && limit >= 0) {
			console.error('createApikey: limit must be number and more than 0');
			return;
		}
		
	}
};