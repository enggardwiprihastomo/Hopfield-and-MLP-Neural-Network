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
                weight[i][j] = value / vector.length;	
            }
        }
    }
    console.log("Weight");
    console.log(weight);
    return weight
}

var findU = function(weight, vector, idx){
    var U = [];
    for(var i=0; i < weight.length; i++){
        U[i] = 0;
        for(var j=0; j < vector.length; j++){
            U[i] += weight[i][j] * vector[j];
        }
    }
    console.log("U" + (idx+1) + ": ");
    console.log(U);
    return U;
}

var activation = function(vector, prevVector, idx){
    var actvector = [];
    for(var i=0; i < vector.length; i++){
        if(vector[i] > 0){
            actvector[i] = 1;
        }
        else if(vector[i] < 0){
            actvector[i] = -1;
        }
        else{
            actvector[i] = prevVector[i];
        }
    }
    console.log("Y" + (idx+1) + ": ");
    console.log(actvector);
    return actvector;
}

var validation = function(vector, prevVector){
    var vecStatus;
    if(prevVector.length == 1){
        vecStatus = true;
        for(var i=0; i < vector.length; i++){
            if(vector[i] != prevVector[0][i]){
                vecStatus = false;
                break;
            }
        }
    }
    else{
        var vecsStatus = [];
        vecStatus = false;
        for(var i=0; i < prevVector.length; i++){
            vecsStatus[i] = true;
            for(var j=0; j < vector.length; j++){
                if(vector[j] != prevVector[i][j]){
                    vecsStatus[i] = false;
                    break;
                }
            }
            vecStatus |= vecsStatus[i];
        }
    }
    return vecStatus;
}

var matchpattern = function(training, test){
    var matchPattern = [];
        for(var i=0; i<training.length; i++){
            matchPattern[i] = true;
        }

        for(var i=0; i<training.length; i++){
            for(var j=0; j<training[i].length; j++){
                if(training[i][j] == test[j]){
                    matchPattern[i] &= true;
                }
                else{
                    matchPattern[i] &= false;
                }
            }
        }

        var nomatching = false;
        for(var i=0; i<matchPattern.length; i++){
            if(matchPattern[i]){
                console.log("The test pattern you have matches with x" + i); 
            }
            nomatching |= matchPattern[i];
        }
        if(!nomatching){
            console.log("The test pattern you have doesn\'t match with any of all training patterns"); 
        }
}

var nextitertest = function(statetest, weight, Y){
    setTimeout(function(statetest, weight, Y){
        if(!statetest){
            if(prevTestVector.length > 1){
                prevTestVector.shift();
                prevTestVector.push(Y);
            }
            else{
                prevTestVector.push(Y);
            }
            itertest++;
            console.log("Iteration-" + itertest + " for Y");
            U = findU(weightvector, Y, -1);
            Y = activation(U, prevTestVector[prevTestVector.length-1], -1);
            val = validation(Y, prevTestVector);
            console.log(val);
            statetest = val;
            nextitertest(statetest, weight, Y);
        }
        else{
            matchpattern(resulttraining, Y);
        }
    }, 1500, statetest, weight, Y);
};

var traintest = function(){
    setTimeout(function(){
        statetest = false;
        itertest = 0;
    
        while(prevTestVector.length != 0){
            prevTestVector.shift();
        }
        prevTestVector = [];
        prevTestVector.push(test[0]);
        itertest++;
        console.log("Iteration-" + itertest + " for Y");
        U = findU(weightvector, test[0], 0);
        Y = activation(U, prevTestVector[prevTestVector.length-1], 0);
        val = validation(Y, prevTestVector);
        console.log(val);
        statetest = val;
        nextitertest(statetest, weightvector, Y);
    }, 1500);
}

var nextiter = function(state, weight, Y){
    var finalStatus = true;
    for(var i=0; i < state.length; i++){
        finalStatus &= state[i];
    }
    if(finalStatus){
        traintest();
    }

    for(var i=0; i < state.length; i++){
        if(!state[i]){
            if(iter[i] == 0){
                prevVector[i] = [];
            }
            if(prevVector[i].length > 1){
                prevVector[i].shift();
                prevVector[i].push(Y);
            }
            else{
                if(iter[i] == 0){
                    prevVector[i].push(x[i]);
                }
                else{
                    prevVector[i].push(Y);
                }
            }

            iter[i]++;
            console.log("Iteration-" + iter[i] + " for x" + (i+1));
            if(iter[i] == 1){
                U = findU(weight, x[i], i);
            }
            else{
                U = findU(weight, Y, i);
            }
            Y = activation(U, prevVector[i][prevVector[i].length-1], i);
            val = validation(Y, prevVector[i]);
            console.log(val);
            state[i] = val;
            nextiter(state, weight, Y);
            break;
        }
        else{
            if(resulttraining[i].length == 0){
                resulttraining[i] = Y;
            }
        }
    }
};

var init = (function(){
    while(state.length != 0){
        state.shift();
    }

    while(prevVector.length != 0){
        prevVector.shift();
    }

    for(var i=0; i < x.length; i++){
        state.push(false);
        iter[i] = 0;
        resulttraining[i] = [];
    }

    weightvector = weight(x);
    for(var i=0; i < x.length; i++){
        prevVector[i] = [];
        prevVector[i].push(x[i]);
        iter[i]++;
        console.log("Iteration-" + iter[i] + " for x" + (i+1));
        U = findU(weightvector, x[i], i);
        Y = activation(U, prevVector[i][prevVector[i].length-1], i);
        val = validation(Y, prevVector[i]);
        state[i] = val;
        nextiter(state, weightvector, Y);
        break;
    }
})();