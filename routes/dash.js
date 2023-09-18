module.exports = {
  name: "dashboard",
  path: "/dashboard-disable",
  type: "get",
  isKey: false,
  isDisable: true,
  hidden: true,
  code: async (req, res, { name, userName, userLimit, apiKey, userEmail, resetLimitTime, utils, cookieApp, bodyApp, path, db }) => {
    cookieApp
	bodyApp 
	
	if(!userName) {
		res.redirect('/signin');
		return;
		//console.log(utils.isLogin(req, res))
	}

	const userAgent = req.headers['user-agent'];
	if (userAgent && userAgent.includes('curl')) {
	  res.status(403).json({ message: "Hello, how are you today :D" });
	  return;
	}
	
    try {
      let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.3.1/socket.io.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      color: #fff;
      background-color: #101010;
      font-family: arial;
    }
    
    hr {
       color: #fff;
       outline: none;
       box-shadow: none;
       border-radius: 10px;
       border: 1px solid rgba(255, 255, 255, 0.50);
    }
    
    button:active,
    button:focus,
    input:active,
    input:focus,
    a:active,
    a:focus,
    a:hover {
      outline: none !important;
      box-shadow: none !important;
    }
    
    .navbar-overlay {
      overflow: hidden;
      position: fixed;
      left: 0;
      right: 30px;
      top: 0;
      height: 100%;
      width: 0;
      background-color: rgba(4, 130, 164);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); 
      overflow-x: hidden;
      transition: 0.3s;
      z-index: 1;
    }
    
    .navbar {
      position: sticky;
      left: 0;
      top: 0;
      width: 100%;
      height: 60px;
      background-color: #01bdff;
      display: flex;
      align-items: center;
      padding: 0 15px;
      box-sizing: border-box;
      z-index: 2;
      margin-top: 0;
    }
    
    .navbtn-list {
      overflow: hidden;
      overflow-y: auto;
      max-height: calc(100vh - 60px);
    }
    
    .navbar-ul {
      list-style-type: none;
      padding: 0;
      margin-top: 15px;
      font-family: arial;
    }
    
    .navbar-menu-title {
       color: #fff;
       font-family: arial;
       font-weight: bold;
       font-size: 20px;
       padding-left: 10px;
       white-space: pre;
    }
    
    .navbar-li {
      white-space: pre;
      margin: 10px;
      overflow: hidden;
      background-color: #01bdff;
      border: 2px solid #01bdff;
      border-radius: 8px;
      transition: opacity 0.5s;
      opacity: 0;
    }
    
    .navbar-li:hover {
      white-space: pre;
      margin: 10px;
      overflow: hidden;
      background-color: #01bdff;
      border: 2px solid #fff;
      border-radius: 8px;
      transition: opacity 0.5s;
      opacity: 0;
    }
    
    .navbar-li.hidden {
      opacity: 1;
    }
    
    .navul-tr {
       
    }
    
    .navli-tr {
       
    }
    
    .navbar-a {
      display: block;
      font-family: arial;
      font-weight: bold;
      font-size: 17.5px;
      color: #fff;
      padding: 10px;
      text-decoration: none;
    }
    
    .navbar-signout {
      display: block;
      font-family: arial;
      font-weight: bold;
      font-size: 17.5px;
      color: #fff;
      padding: 10px;
      border: 0px solid transparent;
      text-decoration: none;
      background-color: #01bdff;
    }
    
    .navbar-toggle {
      display: inline-block;
      color: #fff;
      font-size: 20px;
      margin-right: 15px;
      cursor: pointer;
      background-color: transparent;
      border: 2px solid #fff;
      border-radius: 5px;
      padding: 8px;
      padding-top: 5px;
      padding-bottom: 3px;
    }
    
    .navbar-toggle:hover {
      display: inline-block;
      color: #01bdff;
      font-size: 20px;
      margin-right: 15px;
      cursor: pointer;
      background-color: #fff;
      border: 2px solid #fff;
      border-radius: 5px;
      padding: 8px;
      padding-top: 5px;
      padding-bottom: 3px;
    }
    
    .navbar-title {
      display: inline-block;
      color: #ffffff;
      font-size: 25px;
      font-family: arial;
      font-weight: bold;
      white-space: pre;
    }
    
    .container {
       display: flex;
       justify-content: center;
    }
    
    .card {
      width: 85%;
      padding: 15px;
      margin: 20px;
      border-radius: 7px;
      background-color: rgba(1, 189, 255, 0.70);
    }
    
    .card-title {
       color: #fff;
       font-family: arial;
       font-weight: bold;
       margin-top: 8px;
       margin-bottom: 0;
    }
    
    .card-text {
       color: #fff;
       font-family: arial;
       font-weight: bold;
       font-size: 16px;
       margin-top: -12px;
    }
    
    .card-value {
       font-family: monospace;
       font-size: 14px;
       color: #03fff7;
    }
    
    .open {
      width: 250px;
    }
    
    .navbar-overlay.open {
      width: 75%;
    }
    
    .dropdown-menu {
      display: none;
      background-color: #2099c4;
      width: 100%;
      margin-left: -35px;
    }
    
    .navbar-li:hover .dropdown-menu {
      display: inline-block;
    }
    
    .dropdown-item {
      padding: 3px;
    }
    
    @media only screen and (max-width: 600px) {
      .navbar {
        height: 60px;
      }
    }
  </style>
  <script>
    function toggleNavbar() {
      var navbarOverlay = document.getElementById("navbar-overlay");
      var navbarItems = document.getElementsByClassName("navbar-li");
      
      navbarOverlay.classList.toggle("open");
      
      // Tambahkan logika untuk menyembunyikan elemen ul/li
      for (var i = 0; i < navbarItems.length; i++) {
        navbarItems[i].classList.toggle("hidden");
      }
    }
  </script>
</head>
<body>
  <div class="navbar-overlay" id="navbar-overlay">
    <div class="navbar">
      <button class="navbar-toggle" onclick="toggleNavbar()"><i class="fas fa-bars"></i></button>
      <div class="navbar-title">Zanixon API</div>
    </div>
    <div class="navbtn-list">
      <ul class="navbar-ul">
        <h3 class="navbar-menu-title"> <i class="fas fa-code"> </i>Endpoints category</h3>
        <li class="navbar-li"><a class="navbar-a"><i class="fa-solid fa-pen"> </i> Text</a><ul class="dropdown-menu"><li class="dropdown-item"><a class="navbar-a" href="/docs/quotes">Random Quotes</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/fact">Random Fact</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/islamic">Islamic</a></li></ul></li>
        <li class="navbar-li"><a class="navbar-a"><i class="fa-solid fa-image"> </i> Image</a><ul class="dropdown-menu"><li class="dropdown-item"><a class="navbar-a" href="/docs/animals">Random Animals</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/anime-image">Random Anime Image</a></li></ul></li>
        <li class="navbar-li"><a class="navbar-a"><i class="fa-solid fa-paint-brush"> </i> Canvas</a><ul class="dropdown-menu"><li class="dropdown-item"><a class="navbar-a" href="/docs/ship">Ship</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/jail">Jail</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/canvas#bounty">Bounty</a></li></ul></li>
        <li class="navbar-li"><a class="navbar-a"><i class="fa-solid fa-download"> </i> Downloader</a><ul class="dropdown-menu"><li class="dropdown-item"><a class="navbar-a" href="/docs/ytmp3">YouTube Downloader</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/igdl">Instagram Downloader</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/tiktokdl">TikTok Downloader</a></li></ul></li>
        <li class="navbar-li"><a class="navbar-a"><i class="fa-solid fa-dice-six"> </i> Fun & Games</a><ul class="dropdown-menu"><li class="dropdown-item"><a class="navbar-a" href="/docs/games">Tebak Gambar</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/games">Tebak Kata</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/games">Tebak Bendera</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/games">Siapakah Aku</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/games">Matematika</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/games">Tebak-tebakan</a></li></ul></li>
        <li class="navbar-li"><a class="navbar-a"><i class="fa-solid fa-tools"> </i> Tools</a><ul class="dropdown-menu"><li class="dropdown-item"><a class="navbar-a" href="/docs/tools">Abbreviate (Max 1³⁰⁰)</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/tools">Progress Bar</a></li><li class="dropdown-item"><a class="navbar-a" href="/docs/tools">IP Checker</a></li></ul></li>
        <li class="navbar-li"><a class="navbar-a"><i class="fa-solid fa-ellipsis-h"> </i> Other</a><ul class="dropdown-menu"><li class="dropdown-item"><a class="navbar-a" href="#">Submenu 1</a></li><li class="dropdown-item"><a class="navbar-a" href="#">Submenu 2</a></li><li class="dropdown-item"><a class="navbar-a" href="#">Submenu 3</a></li></ul></li>
        <h3 class="navbar-menu-title"> <i class="fas fa-user"> </i> Account</h3>
        <li class="navbar-li"><a class="navbar-a" href="/account/settings"><i class="fas fa-gear"> </i> Settings</a></li>
        <li class="navbar-li"><form action="/signout" method="post"><button class="navbar-signout" href=""><i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out</button></form></li>
      </ul>
    </div>
  </div>
  
  <div class="navbar" style="background-color: #01bdff;">
    <button class="navbar-toggle" onclick="toggleNavbar()"><i class="fas fa-bars"></i></button>
    <div class="navbar-title">Zanixon API</div>
  </div>
  
  <div class="container">
    <div class="card">
       <h1 style="text-align: center;">Welcome!</h1>
    </div>
  </div>
  
  <div class="container">
    <div class="card">
       <h3 class="card-title">API statistic:</h3><hr><br>
       <p class="card-text">Total request:&nbsp;<span class="card-value">182891821</span></p>
       <p class="card-text">Total user:&nbsp;<span class="card-value">827288</span></p>
    </div>
  </div>
  <div class="container">
    <div class="card">
       <h3 class="card-title">User details:</h3><hr><br>
       <p class="card-text">Username:&nbsp;<span class="card-value">${userName}</span></p>
       <p class="card-text">Limit:&nbsp;<span class="card-value">${resetLimitTime}</span></p>
       <p class="card-text">Apikey:&nbsp;<span class="card-value">${apiKey}</span></p>
       <p class="card-text">Total request user:&nbsp;<span class="card-value">49272</span></p>
    </div>
  </div>
  <div class="container">
     <div class="card">
        <p style="text-align: center; font-family: monospace; font-size: 15px;">Made with 💖 by <a href="https://github.com/ZTRdiamond" style="text-decoration: none; color: #03fff7;">ZTRdiamond</a></p>
        <p style="text-align: center; font-family: monospace; font-size: 14px; margin-top: -10px;">© <a href="https://github.com/ZTRdiamond" style="text-decoration: none; color: #03fff7;">Zanixon Group™</a> All Right Reserved</p>
     </div>
  </div>
</body>
</html>
      `;
      res.send(html);
    } catch (error) {
      res.status(500).send('Terjadi kesalahan saat memuat halaman dashboard');
    }
  }
};
