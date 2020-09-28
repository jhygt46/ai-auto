

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
    objeto_tipo: function(obj){
        if(obj.tipo == 1){
            return { t: 1, n: obj.nombre, ops: [], v: 0 }
        }
        if(obj.tipo == 2){
            return { t: 2, n: obj.nombre, ops: [], v: 0 }
        }
    },
    objeto_opcion_tipo: function(obj, campo){
        if(campo.t == 1){
            return { n: obj.val, v: 0 }
        }
        if(campo.t == 2){
            return { n: obj.val, v: 0 }
        }
    },
    ca_add_campo: function(campos, cambio){
        if(campos == undefined){ campos = [] }
        campos.push(this.objeto_tipo(cambio));
        return campos;
    },
    ca_add_opcion_campo: function(campos, cambio){
        var pos = (cambio.pos == -1) ? campos.length - 1 : cambio.pos ;
        campos[pos].ops.push(this.objeto_opcion_tipo(cambio, campos[pos]));
        return campos;
    },
    filtroCambios: function(json, cambios){
        console.log(json);
        console.log("BUENA NELSOn");
        console.log(cambios);
        if(json === null){ json = {} }else{ // VERIFICAR SI EXISTE }
        for(var i=0, ilen=cambios.length; i<ilen; i++){
            switch(cambios[i].acc){
                case "add_campo":
                    json['campos'] = this.ca_add_campo(json['campos'], cambios[i]);
                    break;
                case "add_opcion_campo":
                    json['campos'] = this.ca_add_opcion_campo(json['campos'], cambios[i]);
                    break;
              }
        }
        return json;
    }
};