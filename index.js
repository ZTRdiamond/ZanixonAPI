const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const socketio = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const db = require("./lib/db.js");
require("./config.js");
const colors = require("colors");
const moment = require("moment-timezone");
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { getCookie, getCsrfToken } = require("insta-fetcher");
const utils = require("./lib/utils.js");

//custom colors for beautiful console.log()
colors.setTheme({
   zanixon: ['cyan', 'bold'],
   silly: 'rainbow',
   input: 'grey',
   verbose: 'cyan',
   prompt: 'grey',
   info: 'green',
   data: 'grey',
   help: 'cyan',
   warn: 'yellow',
   debug: 'blue',
   error: 'brightRed'
});

// Body parser 
const bodyApp = app.use(bodyParser.urlencoded({ extended: false }));
// Cookie parser
const cookieApp = app.use(cookieParser());
// Call
bodyApp
cookieApp

//data user untuk dashboard dll
let userName = undefined;
let userEmail = undefined;
let apiKey = undefined;
let userLimit = undefined;
let resetLimitTime = undefined;
let totalUserRequest = undefined;
let totalRequest = db.get("totalRequest", null, 'default', false);
let totalUserRegister = db.get("totalUserRegister", null, "account", false);


// cookies config
app.use(cookieSession({
  name: 'session',
  keys: global.sessionKeys,
  maxAge: 30 * 24 * 60 * 60 * 1000, // Durasi maksimum cookie (24 jam dalam contoh ini)
}));

// Handler function to process routes
function routeHandler(directory) {
   const files = glob.sync(`${directory}/**/*.js`);
   
   try {
       
      files.forEach((file) => {
         const route = require(path.join(__dirname, file));
         if (route.path != undefined) {
            const {
               name,
               path,
               details,
               type,
               isDisable,
               iskey,
               isLimit,
               rateLimit,
               hidden,
               code
            } = route;
            const routePath = (path.startsWith("/") ? path : "/" + path);

            app.use(routePath, (req, res, next) => {
               //dotfiles: 'allow'
               next();
            });
            
            if(!type) {
                console.log("Route method type can't be undefined!".error + " location: ".info + file.debug)
                process.exit()
            }

            app[type](routePath, async (req, res) => {
               function send(result) {
                   res.setHeader("Content-Type", "application/json");
                   result = JSON.parse(result, null, 2);
                   res.send(result);
               };
                
               //options 
               const query = req.query;
               const name = route.name ? route.name : "none";
               const isKey = route.isKey ? route.isKey : false;
               const pathRoute = route.path ? route.path : "";
               const details = route.details ? route.details : "";
               const isDisable = route.isDisable ? route.isDisable : false;
			   const path = require('path');
			   const igCookie = await getCookie(global.ig.username, global.ig.password);
			   //user info option 
			   userName = req.session.user ? req.session.user : db.get('username', req.query.apikey, 'apikey', false);
			   userEmail = db.get("email", userName, 'account', false);
			   apiKey = db.get("apikey", userName, 'account', false);
			   userLimit = db.get("limit", userName, 'account', false); // ? 0 : `${db.get("limit", userName, 'account', false)} / ${utils.resetLimitTime(userName)}`
			   resetLimitTime = userLimit ? userLimit : utils.resetLimitTime(userName);
			   totalRequest = db.get("totalRequest", null, 'default', false);
			   totalUserRequest = db.get("totalRequest", userName, "account", false) || 0;
               const isValidApikey = utils.isValidApikey(userName, req.query.apikey);
			   
			   if (userLimit <= 0) {
			       utils.resetLimit(userName); //limit reset if user have 0 limit and cooldown was false
			   }
			   
			   //checking route is disable
               if (isDisable == true) {
                  res.status(406).json(global.errMsg.disable)
                  return;
               }
               
               //checking is route using key or not
               if(isKey == true) {
                   if(!req.query.apikey) {
                       res.status(400).json(global.errMsg.nullApikey);
                       return;
                   }
                   
                   if(isValidApikey == false) {
                       res.status(401).json(global.errMsg.invalidApikey);
                       return;
                   }
               }
               
               //checking user have limit or no
               if(isLimit == true) {
                   if(userLimit > 0) {
                       db.set("limit", userLimit - 1, userName, 'account', false)
                   } else {
                       res.status(401).json(global.errMsg.limitReached);
                       return;
                   }
               }
               
               const rl = rateLimit ? true : false;
               if(rl == true) { 
			      const cd = utils.rateLimit(name, rateLimit.type, rateLimit.duration, query.apikey);
			      if(cd.cooldown == true) {
			          res.status(429).json({ status: 429, error: "Cooldown, please wait...", time: cd.time, timestamp: cd.timestamp });
			          return;
			      };
               };
               
               db.set("totalRequest", totalRequest + 1, null, "default", false);
               db.set("totalRequest", totalUserRequest + 1, userName, "account", false);

               //options export
               const routeOptions = {
                  send,
                  query,
                  name,
                  pathRoute,
                  details,
                  type,
                  isKey,
                  isDisable,
                  userName,
                  userEmail,
                  apiKey,
                  igCookie,
                  userLimit,
                  totalUserRequest,
                  totalUserRegister,
                  totalRequest,
                  resetLimitTime,
                  isValidApikey,
                  db,
                  axios,
                  path,
                  utils,
                  bodyApp,
                  cookieApp
               };
               try {
                  res.setHeader("Content-Type", "application/json");
                  const result = await code(req, res, routeOptions);
                  result;
               } catch (error) {
                  res.status(500).json({
                     status: 500,
                     error: error.message
                  });
                  console.log('Something went wrong on: \n'.info + error)
               }
               
               
            });
            let routeDis = isDisable ? 'Disable'.brightRed : 'Active'.brightCyan;
            hidden ? false : console.log(`┃ ⬤ ` + `${routeDis}` + ' - ' + `Loading `.info + `${name}`.warn + ` on path: `.info + `${path}`.debug);
         }
         route.path ? undefined : console.log(`┃ ⬤ ` + `Failed to load`.error + ` ${route.name ? route.name : "routes"}`.warn + ` on location: `.info + file.debug);
      });
   } catch (err) {
      console.log(err);
   }

   app.use((req, res) => {
      res.status(404).json({
         status: 404,
         error: 'Route not found'
      });
   });

   app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({
         status: 500,
         error: err.message
      });
   });
};

// to running route from pagesRouting
//app.use("/", pagesRouting)

// to make file in assets to be static
app.use("/static", express.static(path.join(__dirname, 'assets')));
app.use("/config", express.static(path.join(__dirname, 'config')));

io.on('connection', (socket) => {
  //console.log('Client connected to Socket.io');
 
let userData = {
  userName: userName,
  userEmail: userEmail,
  apiKey: apiKey,
  userLimit: `${userLimit}`,
  resetLimitTime: `${resetLimitTime}`,
  totalRequest: totalRequest,
  totalUserRequest: totalUserRequest,
  totalUserRegister: totalUserRegister
};
//console.log(userData)

  socket.on('userSession', () => {
    socket.emit('session', userData);
  });
});

app.get("/dashboard", (req, res) => {
	userName = req.session.user ? req.session.user : db.get('username', req.query.apikey, 'apikey', false);
	userEmail = db.get("email", userName, 'account', false);
	apiKey = db.get("apikey", userName, 'account', false);
	userLimit = db.get("limit", userName, 'account', false); // ? 0 : `${db.get("limit", userName, 'account', false)} / ${utils.resetLimitTime(userName)}`
	resetLimitTime = userLimit ? userLimit : utils.resetLimitTime(userName);
	totalUserRequest = db.get("totalRequest", userName, "account", false);
	totalUserRegister = db.get("totalUserRegister", null, "account", false);
    //console.log({ userName, userEmail, apiKey, userLimit, resetLimitTime, totalUserRequest, totalUserRegister })
    
    if(apiKey != undefined) {
        res.sendFile(__dirname + '/pages/dashboard.html'); 
        return;
    } else {
        res.redirect("/signin");
        return;
    }
})

// Menampilkan halaman utama
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'];
  if (userAgent && userAgent.includes('curl')) {
    res.status(403).json({ message: "Hello, how are you today :D" });
    return;
  }
  
  res.sendFile(__dirname + '/pages/main.html');
});

// Menampilkan halaman sign-in
app.get('/signin', (req, res) => {
  const userAgent = req.headers['user-agent'];
  if (userAgent && userAgent.includes('curl')) {
    res.status(403).json({ message: "Hello, how are you today :D" });
    return;
  }
  
  if(req.session.user != null) {
      res.redirect("/dashboard");
      return;
  }
  
  res.sendFile(__dirname + '/pages/signin.html');
});

// Memproses login
app.post('/signin', (req, res) => {
  const userAgent = req.headers['user-agent'];
  if (userAgent && userAgent.includes('curl')) {
    res.status(403).json({ message: "Hello, how are you today :D" });
    return;
  }
  const username = req.body.username;
  const password = req.body.password;
  const user = { username: username };

  if (db.has(username, null, "account", true) == true) {
    const acc = db.get(username, null, "account", true);
    if (acc.password == password) {
      // Menyimpan cookie setelah login berhasil
      req.session.user = username;
      res.json({ success: true, redirectUrl: '/dashboard' });
    } else {
      res.json({ success: false, message: 'The password you entered is incorrect.' });
    }
  } else {
    res.json({ success: false, message: 'Account not registered please register first.' });
  }
});



// Menampilkan halaman signup
app.get('/signup', (req, res) => {
  const userAgent = req.headers['user-agent'];
  if (userAgent && userAgent.includes('curl')) {
    res.status(403).json({ message: "Hello, how are you today :D" });
    return;
  }
  console.log(req.session.user)
  if(req.session.user != null) {
      res.redirect("/dashboard");
      return;
  }
  
  res.sendFile(__dirname + '/pages/signup.html');
});

// Memproses signup
app.post('/signup', (req, res) => {
  const userAgent = req.headers['user-agent'];
  if (userAgent && userAgent.includes('curl')) {
    res.status(403).json({ message: "Hello, how are you today :D" });
    return;
  }
  const { username, password, email } = req.body;
  if (utils.isRegistered(username, email) == false) {
      utils.signup(username, password, email);
      res.json({ success: true, redirectUrl: '/signin' });
   } else {
      // Jika username atau email sudah terdaftar
      res.json({ success: false, message: 'Username or email has been used to register' });
   }
}); 

app.post('/signout', (req, res) => {
	req.session.user = null;
	res.redirect("/signin");
});

app.get("/docs", (req, res) => {
    res.redirect("/docs/text");
});

app.get("/docs/text", (req, res) => {
    const userAgent = req.headers['user-agent'];
    if (userAgent && userAgent.includes('curl')) {
      res.status(403).json({ message: "Hello, how are you today :D" });
      return;
    }
    
    res.sendFile(__dirname + '/pages/docs/text.html');
});

// Loading routes from handlers
console.log(`┏━━━━━━❰ ` + `Loading Routes...`.zanixon + ` ❱━━━━━ꕥ`);
routeHandler("routes");
console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ꕥ`);

// Start the API
const port = process.env.PORT || global.port;
server.listen(port, () => {
  console.log('> ' + utils.clock().brightCyan + '︱' + `Zanixon API is running on port ${port}`.brightGreen);
});
