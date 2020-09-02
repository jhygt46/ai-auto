

module.exports = {
    getPort: function (){
        return 80;
    },
    combinaciones: function(a, b){
        if (a.toString() < b.toString()) return -1;
        if (a.toString() > b.toString()) return 1;
        return 0;
    },
    compare: function(a, b){
        return (a == b) ? 1 : 0 ;
    }
};