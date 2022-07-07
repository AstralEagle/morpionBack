class Test{

constructor(name){
    this.name = name;
    this.tab = newPlato;
}

}

function newPlato(){
    let r = [];
    for(var i=0;i<3;i++){
        r[i] = [];
        for(var o =0;o<3;o++){
            r[i][o] = {position: i+""+o,value:"O"};
        }
    }

    return r;
}