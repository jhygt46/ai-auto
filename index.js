

var fs = require('fs');
var helpers = require('./helpers');
var config = JSON.parse(fs.readFileSync('./config.json'));

/*
var io = require('socket.io-client');
var socket = io.connect(config.socket_url, { reconnect: true });

socket.on('connect', function() {
    console.log('Connected!');
});
socket.onevent = function(packet){
    switch (packet.data[0]) {
        case 'cambiar_precio':
            cambiar_precio(packet.data[1]);
        break;
    }
}
socket.on('disconnect', function() {
    console.log('Disconnected!');
});
*/

const express = require("express");
const app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req, res){

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(helpers.compare("Rest", "Rest")));

});

var data = { "r": { "e": { "&": ["Buena", "Nelson"] } } };

app.post('/ac', urlencodedParser, function(req, res){

    res.setHeader('Content-Type', 'application/json');
    
    var palabra = "re";
    var palabra_ant = "re";
    var peticiones = helpers.combinaciones(palabra, palabra_ant);
    var nlen = palabra.length;

    
    switch (nlen) {
        case 1:
            var resp = data[palabra[0]]['&'];
        break;
        case 2:
            var resp = data[palabra[0]][palabra[1]]['&'];
        break;
        case 2:
            var resp = data[palabra[0]][palabra[1]][palabra[2]]['&'];
        break;
    }
    

    res.end(JSON.stringify(resp));

});

app.listen(config.port, () => {
    fs.appendFile('init.log', 'Servidor iniciado a las ' + new Date().toLocaleString() + ' en puerto ' + config.port + '\n', function(err){ if(err) return console.log(err); console.log("SERVER START") });
});
/* 
if(!data.hasOwnProperty(palabra[0])){ 
    data[palabra[0]] = {}; 
    if(nlen == 1){ 
        data[palabra[0]]['&'] = id; 
        return 0; 
    }
}else{ 
    if(nlen == 1){ 
        if(mails[domain][name[0]]['&'] == undefined){ 
            mails[domain][name[0]]['&'] = id; 
            return 0; 
        }else{ 
            return 1; 
        }
    }
}
*/