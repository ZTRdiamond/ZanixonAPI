module.exports = {
  name: "random number",
  path: '/random-number/:min/:max',
  details: {
    title: 'Random Number',
    desc: 'Generate a random number within a range',
    usage: 'GET: /random-number/{min}/{max}',
  },
  disable: false,
  isKey: true,
  isLimit: true,
  type: 'get',
  code: async (req, res, { query, name, details, isKey, totalUserRegister }) => {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);

    // Memastikan min dan max adalah bilangan yang valid
    if (isNaN(min) || isNaN(max)) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    // Memastikan min tidak lebih besar dari max
    if (min > max) {
      res.status(400).json({ error: 'Invalid input: min should be smaller than max' });
      return;
    }

    // Menghasilkan bilangan acak dalam rentang yang ditentukan
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    
    let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>${name}</h1>
        <p>${details.desc}</p>
        <a href="/">Total Register: ${totalUserRegister}</a>
        <p>Random Number: ${randomNum}</p>
      </body>
    </html>
    `
    res.send(html);
  },
};
