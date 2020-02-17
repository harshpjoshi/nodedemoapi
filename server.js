const http = require('http');
const app = require('./app');

const server = http.createServer(app);

var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);

