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
        case 'cambiar_filtro':
            cambioFiltro(packet.data[1]);
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

var data = {};
var limit = 4;

//ADD PALABRA
function add_palabra_force(obj, lvl, num = 0){

    var l0 = obj.n[0];
    var l1 = obj.n[1];
    var rest = obj.n.substring(2);
    
    if(!data.hasOwnProperty(l0)){
        data[l0] = {};
    }
    if(!data[l0].hasOwnProperty(l1)){
        data[l0][l1] = {};
    }
    
    switch(lvl){
        case 0:
            if(!data[l0][l1].hasOwnProperty('&')){
                data[l0][l1]['&'] = [helpers.objeto_palabra(obj, 2)];
            }else{
                if(data[l0][l1]['&'].length < limit){
                    data[l0][l1]['&'].unshift(helpers.objeto_palabra(obj, 2));
                }else{
                    var last = data[l0][l1]['&'].pop();
                    data[l0][l1]['&'].unshift(helpers.objeto_palabra(obj, 2));
                    add_palabra_force(last, lvl+1);
                }
            }
        break;
        case 1:
            if(!data[l0][l1].hasOwnProperty(rest[0])){
                data[l0][l1][rest[0]] = { '&': [helpers.objeto_palabra(obj, 3)] };
            }else{
                if(data[l0][l1][rest[0]]['&'].length < limit){
                    data[l0][l1][rest[0]]['&'].unshift(helpers.objeto_palabra(obj, 3));
                }else{
                    var last = data[l0][l1][rest[0]]['&'].pop();
                    data[l0][l1][rest[0]]['&'].unshift(helpers.objeto_palabra(obj, 3));
                    add_palabra_force(last, lvl+1);
                }
            }
        break;
        case 2:
            if(!data[l0][l1][rest[0]].hasOwnProperty(rest[0])){
                data[l0][l1][rest[0]][rest[1]] = { '&': [helpers.objeto_palabra(obj, 4)] };
            }else{
                if(data[l0][l1][rest[0]][rest[1]]['&'].length < limit){
                    data[l0][l1][rest[0]][rest[1]]['&'].unshift(helpers.objeto_palabra(obj, 4));
                }else{
                    var last = data[l0][l1][rest[0]][rest[1]]['&'].pop();
                    data[l0][l1][rest[0]][rest[1]]['&'].unshift(helpers.objeto_palabra(obj, 4));
                    add_palabra_force(last, lvl+1);
                }
            }
        break;
    }

}
function add_palabra(obj, lvl = 0){

    var l0 = obj.n[0];
    var l1 = obj.n[1];
    var rest = obj.n.substring(2);
    if(!data.hasOwnProperty(l0)){ data[l0] = {} }
    if(!data[l0].hasOwnProperty(l1)){ data[l0][l1] = {} }

    switch(lvl){
        case 0:
            if(!data[l0][l1].hasOwnProperty('&')){
                data[l0][l1]['&'] = [helpers.objeto_palabra(obj, 2)];
            }else{
                if(data[l0][l1]['&'].length < limit){
                    data[l0][l1]['&'].push(helpers.objeto_palabra(obj, 2));                        
                }else{
                    var last = data[l0][l1]['&'].pop();
                    last.n = l0+l1+last.n;
                    data[l0][l1]['&'].unshift(helpers.objeto_palabra(obj, 2));
                    add_palabra_force(last, lvl+1);
                }
            }
        break;
        case 1:
            if(!data[l0][l1].hasOwnProperty(rest[0])){
                data[l0][l1][rest[0]] = { '&': [helpers.objeto_palabra(obj, 3)] };
            }else{
                if(data[l0][l1][rest[0]]['&'].length < limit){
                    data[l0][l1][rest[0]]['&'].push(helpers.objeto_palabra(obj, 3));
                }else{
                    var last = data[l0][l1][rest[0]]['&'].pop();
                    last.n = l0+l1+[rest[0]]+last.n;
                    data[l0][l1][rest[0]]['&'].unshift(helpers.objeto_palabra(obj, 3));
                    add_palabra_force(last, lvl+1);
                }
            }
        break;
        case 2:
            if(!data[l0][l1][rest[0]].hasOwnProperty(rest[1])){
                data[l0][l1][rest[0]][rest[1]] = { '&': [helpers.objeto_palabra(obj, 4)] };
            }else{
                if(data[l0][l1][rest[0]][rest[1]]['&'].length < limit){
                    data[l0][l1][rest[0]][rest[1]]['&'].push(helpers.objeto_palabra(obj, 4));
                }else{
                    var last = data[l0][l1][rest[0]][rest[1]]['&'].pop();
                    //data[l0][l1][rest[0]][rest[1]]['&'].unshift(helpers.objeto_palabra(obj, 2));
                    //add_palabra_force(last, lvl+1);
                }
            }
        break;
    }
    
}
function lista_palabras(base, i){
    var palabra = base.substring(0, i);
    switch (palabra.length) {
        case 2:
            try{ return data[palabra[0]][palabra[1]]['&'] }catch(e){ return [] }
        break;
        case 3:
            try{ return data[palabra[0]][palabra[1]][palabra[2]]['&'] }catch(e){ return [] }
        break;
        case 4:
            try{ return data[palabra[0]][palabra[1]][palabra[2]][palabra[3]]['&'] }catch(e){ return [] }
        break;
    }
}
function listas_palabras(palabra, palabra_ant){

    var resp = [];
    if(palabra_ant == undefined){ palabra_ant = palabra.substring(0, 1) }
    for(var i=palabra_ant.length+1, ilen=palabra.length; i<=ilen; i++){
        resp = resp.concat(lista_palabras(palabra, i));
    }
    return resp;

}
function get_palabra(obj){
    for(var i=2, ilen=obj.n.length; i<=ilen; i++){
        if(helpers.compare_objetos(lista_palabras(obj.n, i), obj, obj.n.substring(0, i))){
            return { op: true, lvl: i };
        }
    }
    return { op: false };
}
function delete_obj(obj){

    var aux = get_palabra(obj);
    var l0 = obj.n[0];
    var l1 = obj.n[1];
    var rest = obj.n.substring(2);

    console.log(aux);

    if(aux.op){
        switch (aux.lvl) {
            case 2:
                data[l0][l1]['&'] = helpers.nueva_lista(lista_palabras(obj.n, aux.lvl), obj, aux.lvl);
            break;
            case 3:
                data[l0][l1][rest[0]]['&'] = helpers.nueva_lista(lista_palabras(obj.n, aux.lvl), obj, aux.lvl);
            break;
            case 4:
                data[l0][l1][rest[0]][rest[1]]['&'] = helpers.nueva_lista(lista_palabras(obj.n, aux.lvl), obj, aux.lvl);
            break;
            case 5:
                data[l0][l1][rest[0]][rest[1]][rest[2]]['&'] = helpers.nueva_lista(lista_palabras(obj.n, aux.lvl), obj, aux.lvl);
            break;
        }
    }

}
function cambioFiltro(obj){

    var path = obj.n;
    fs.access('./filtros/'+path, fs.F_OK, (err) => {
        if(!err){
            fs.readFile('./filtros/'+path, (err, data) => {
                if(!err){ 
                    fs.writeFile('./filtros/'+path, JSON.stringify(helpers.filtroCambios(JSON.parse(data), obj.c)), (err) => { 
                        if(err){ console.error(err); return }
                    }); 
                }else{ console.error(err); return }
            }); 
        }else{
            fs.writeFile('./filtros/'+path, JSON.stringify(helpers.filtroCambios(null, obj.c)), (err) => { 
                if(err){ console.error(err); return }
            });
        }
    })
    
}

app.post('/cambios_filtros', function(req, res){

    res.setHeader('Content-Type', 'application/json');
    //var obj = { n: 'rest', p: 0 };
    //console.log(get_palabra(obj));
    cambioFiltro({ n: req.body.filtro, c: req.body.cambios });
    res.end("{ op: 1 }");

});
app.get('/filtro', function(req, res){

    res.setHeader('Content-Type', 'application/json');
    fs.access('./filtros/'+req.query.f, fs.F_OK, (err) => { 
        if(!err){
            fs.readFile('./filtros/'+req.query.f, (err, data) => { 
                if(!err){ 
                    res.end(JSON.stringify(JSON.parse(data), null, 4));
                }else{ 
                    res.end("Error");
                }
            })
        }else{ 
            res.end("Error");
        }
    });

});
app.get('/del', function(req, res){

    res.setHeader('Content-Type', 'application/json');
    var obj = { n: 'rest', i: 3 };
    delete_obj(obj);
    res.end(JSON.stringify(data, null, 4));

});

app.post('/ac', urlencodedParser, function(req, res){

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(listas_palabras(req.body.palabra, req.body.palabra_ant)));
    
});
app.post('/get_filtro', function(req, res){

    res.setHeader('Content-Type', 'application/json');
    var path = req.body.num;
    fs.access('./filtros/'+path, fs.F_OK, (err) => { 
    if(!err){ fs.readFile('./filtros/'+path, (err, data) => { 
        if(!err){ res.end(data) }else{ console.error(err); return }
    }); }else{ console.error(err); return }})

});

app.listen(config.port, () => {
    fs.appendFile('init.log', 'Servidor iniciado a las ' + new Date().toLocaleString() + ' en puerto ' + config.port + '\n', (err) => { if(err) return console.log(err); console.log("SERVER START") });
    var objs = [{ n: 're', i: 1 }, { n: 'res', i: 2 }, { n: 'rest', i: 3 }, { n: 'resta', i: 4 }, { n: 'restau', i: 5 }, { n: 'restaur', i: 6 }];
    for(var i=0, ilen=objs.length; i<ilen; i++){
        add_palabra(objs[i], 0);
    }
});
