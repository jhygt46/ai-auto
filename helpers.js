module.exports = {
    compare_objetos: function(objs, obj, base = ""){
        var obj_key = Object.keys(obj);
        for(var i=0, ilen=objs.length; i<ilen; i++){
            var el_key = Object.keys(objs[i]);
            if(el_key.length == obj_key.length){
                var x = 0;
                for(var k in obj){ if(objs[i][k] !== undefined){ if(k == 'n' && base+objs[i][k] == obj[k] || k != 'n' && objs[i][k] == obj[k]){ x++ }}}
                if(x == el_key.length){ return true }
            }
        }
        return false;
    },
    objeto_palabra: function(obj, n){
        obj.n = obj.n.substring(n);
        return obj;
    },
    nueva_lista: function(lista, obj, lvl){
        var res = [];
        for(var i=0, ilen=lista.length; i<ilen; i++){
            if(obj.n.substring(0, lvl) + lista[i].n != obj.n || lista[i].i != obj.i){
                res.push(lista[i]);
            }
        }
        return res;
    },
    objeto_opcion_tipo: function(obj, campo){
        if(campo.t == 1){
            return { n: obj.val, v: 0 }
        }
        if(campo.t == 2){
            return { n: obj.val, v: 0 }
        }
    },
    ca_add_opcion_campo: function(campos, cambio){
        var pos = (cambio.pos == -1) ? campos.length - 1 : cambio.pos ;
        campos[pos].ops.push(this.objeto_opcion_tipo(cambio, campos[pos]));
        return campos;
    },
    ca_mod_opcion_campo: function(campos, cambio){
        campos[pos].ops[cambio.pos] = this.objeto_opcion_tipo_mod(cambio, campos[pos]);
        return campos;
    },
    objeto_tipo: function(obj){
        if(obj.tipo == 1){
            return { tipo: 1, nombre: obj.nombre, ops: [], v: 0 }
        }
        if(obj.tipo == 2){
            return { tipo: 2, nombre: obj.nombre, ops: [], v: 0 }
        }
    },
    get_filtro_objetos: function(t){
        if(t == 1){
            return { campos: { tipo: [1, 0], nombre: [1, 1], ops: [0, 0], v: [0, 0] }, cant_keys: 2 }
        }
        if(t == 2){
            return { campos: { tipo: [1, 0], nombre: [1, 1], ops: [0, 0], v: [0, 0] }, cant_keys: 2 }
        }
    },
    ca_add_campo: function(data, cambio){

        var res = { op: 2, err: 'desconocido', data: data }

        if(data.campos === undefined){

            res.op = 1;
            res.data.campos = [];
            res.data.campos.push(this.objeto_tipo(cambio));

        }else{

            var obj = this.get_filtro_objetos(cambio.tipo);
            var aux = Object.keys(obj.campos);

            console.log(cambio);

            for(var i=0, ilen=data.campos.length; i<ilen; i++){
                //console.log(data.campos[i]);
                for(var j=0, jlen=aux.length; j<jlen; j++){
                    if(cambio.hasOwnProperty(aux[j])){
                        console.log("CAMBIO TIENE "+aux[j]);
                    }else{
                        console.log("CAMBIO NO TIENE "+aux[j]);
                    }
                    //console.log(aux[j]);
                    //console.log(obj.campos[aux[j]][0]);
                }
            }

            /*
            console.log("obj");
            console.log(obj);
            console.log("aux");
            console.log(aux);
            */
            
            res.op = 1;
            //res.data.campos.push(this.objeto_tipo(cambio));


            /*
            var obj = this.get_filtro_objetos(cambio.tipo);
            var aux = Object.keys(obj.campos);
            var insert = true;
            for(var j=0, jlen=campos.length; j<jlen; j++){
                for(var i=0, ilen=aux.length; i<ilen; i++){
                    //console.log(aux[i]);
                    //console.log(cambio[aux[i]]);
                    if(obj.campos[aux[i]][0] == 1){

                    }
                }
            }
            if(insert){
                campos.push(this.objeto_tipo(cambio));
            }
            return campos;
            */
        }
        return res;

    },
    filtroCambios: function(json, cambios){
        return new Promise((resolve, reject) => {
            if(json === null){ json = {} }
            for(var i=0, ilen=cambios.length; i<ilen; i++){
                switch(cambios[i].acc){
                    case "add_campo":
                        aux = this.ca_add_campo(json, cambios[i]);
                        if(aux.op == 1){ json = aux.data }else{ reject(aux.err) }
                        break;
                    case "add_opcion_campo":
                        aux = this.ca_add_opcion_campo(json, cambios[i]);
                        if(aux.op == 1){ json = aux.data }else{ reject(aux.err) }
                        break;
                    case "mod_opcion_campo":
                        aux = this.ca_mod_opcion_campo(json, cambios[i]);
                        if(aux.op == 1){ json = aux.data }else{ reject(aux.err) }
                        break;
                }
            }
            resolve(json);
        });
    }
}