x = [[1,1,1],[-1,-1,-1]];

var weight = function(vector){
    var w = [], value,
        weight = [];

    for(var i=0; i < vector.length; i++){
        w[i] = [];
        for(var j=0; j < vector[i].length; j++){
            w[i][j]= [];
            for(var k=0; k < vector[i].length; k++){
                if(j==k){
                    w[i][j][k] = 0;	
                }
                else{
                    w[i][j][k] = vector[i][j] * vector[i][k];
                }
            }
        }
    }

    for(var i=0; i < vector[0].length; i++){
        weight[i] = [];
        for(var j=0; j < vector[0].length; j++){
            value = 0;
            for(var k=0; k < vector.length; k++){
                value += w[k][j][i];
                weight[i][j] = value / vector[0].length;	
            }
        }
    }
    return weight;
}

var findU = function(weight, vector){
    var U = 0;
    for(var i=0; i < vector.length; i++){
        U += weight[i] * vector[i];
    }
    console.log(U);
    return U;
}

var activation = function(node, prevNode){
    var actNode;
    if(node > 0){
        actNode = 1;
    }
    else if(node < 0){
        actNode = -1;
    }
    else{
        actNode = prevNode;
    }
    console.log(actNode);
    return actNode;
}

var validation = function(node, prevNode){
    if(node == prevNode){
        return true;
    }
    else{
        return false;
    }
}

var idx = 0;
var vid = 0;

var nextiter = function(status, Y, previousNode){
    if(status){
        if(vid < x.length){
            if(idx < x[0].length){
                idx++;
                
            }
            vid++;
        }
    }
}

var init = (function(){
    prevNode = x[vid][idx];
    weightvector = weight(x);
    U = findU(weightvector[idx], x[idx]);
    Y = activation(U, prevNode);
    val = validation(Y, prevNode);
    nextiter(val, Y, prevNode);
})();