const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const bodyParser = require('body-parser');

require('./config/database.config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

const algorithm = require('./uc-algorithm/controller')
const mainRoute = require('./routes/main-route');

io.on('connection', function(socket) {
  console.log('A user connected!');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('error', function() {
    console.log('An error has occured');
  });

  socket.on('send', function(data, language) {
    socket.emit('receive', algorithm(data, language))
  })
});

app.use('/', mainRoute);

http.listen(process.env.PORT || 4200, function(){
  console.log('listening on port:' + (process.env.PORT || 4200));
});
