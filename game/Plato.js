class Plato{
    constructor(){
        this.plato = newPlato();
    }
    
    

    newGame(){
        this.plato = newPlato();
    }
    setCase(objet){
        const pos = objet.position.split("");
        this.plato[pos[0]][pos[1]] = objet;

    }
}  
function newPlato(){
    let r = [];
    for(var i=0;i<3;i++){
        r[i] = [];
        for(var o =0;o<3;o++){
            r[i][o] = {position: i+""+o,value:"."};
        }
    }

    return r;
}


module.exports = new Plato();