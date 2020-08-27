var NetController = (function(){
    var x = [],
    testVector = [],
    prevVector = [],
    prevTestVector = [],
    state = [],
    statetest,
    iter = [],
    itertest,
    resulttraining = [],
    weightvector =[],
    dimension = [];

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
        document.querySelector(".resultdesc").innerHTML += "Weight of vector X = [";
        for(var i=0; i<weight.length; i++){
            for(var j=0; j<weight[0].length;j++){
                if(i == weight.length-1 && j == weight[0].length-1){
                    document.querySelector(".resultdesc").innerHTML += weight[i][j];
                }
                else if(j == weight[0].length-1){
                    document.querySelector(".resultdesc").innerHTML += weight[i][j] + "<font class='redbold'>;</font> ";    
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += weight[i][j] + ", ";
                }
            }
        }
        document.querySelector(".resultdesc").innerHTML += "]<br>";
        return weight;
    }
    
    var transpose = function(vector, idx){
        if(idx == -1){
            document.querySelector(".resultdesc").innerHTML += "Transpose of vector y = [";
        }
        else{
            document.querySelector(".resultdesc").innerHTML += "Transpose of vector x" + (idx+1) + " = [";
        }
        for(var i=0; i < vector.length; i++){
            if(i == vector.length-1){
                document.querySelector(".resultdesc").innerHTML += vector[i];     
            }
            else{
                document.querySelector(".resultdesc").innerHTML += vector[i] + ", ";
            }
        }
        document.querySelector(".resultdesc").innerHTML += "]<sup>T</sup><br><br>";
    }
    
    var findU = function(weight, vector, idx){
        var U = [];
        for(var i=0; i < weight.length; i++){
            U[i] = 0;
            for(var j=0; j < vector.length; j++){
                U[i] += weight[i][j] * vector[j];
            }
        }

        if(idx == -1){
            document.querySelector(".resultdesc").innerHTML += "Result of weight*y = [";
        }
        else{
            document.querySelector(".resultdesc").innerHTML += "Result of weight*x" + (idx+1) + " = [";
        }
        for(var i=0; i < U.length; i++){
            if(i == U.length-1){
                document.querySelector(".resultdesc").innerHTML += U[i];     
            }
            else{
                document.querySelector(".resultdesc").innerHTML += U[i] + ", ";
            }
        }
        document.querySelector(".resultdesc").innerHTML += "]<br><br>";
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

        if(idx == -1){
            document.querySelector(".resultdesc").innerHTML += "Result of SIGN(weight*y) = [";
        }
        else{
            document.querySelector(".resultdesc").innerHTML += "Result of SIGN(weight*x" + (idx+1) + ") = [";
        }
        for(var i=0; i < actvector.length; i++){
            if(i == actvector.length-1){
                document.querySelector(".resultdesc").innerHTML += actvector[i];     
            }
            else{
                document.querySelector(".resultdesc").innerHTML += actvector[i] + ", ";
            }
        }
        document.querySelector(".resultdesc").innerHTML += "]<br><br>";
        return actvector;
    }
    
    var validation = function(vector, prevVector, iter, idx){
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
        if(idx == -1){
            if(iter == 1 && vecStatus){
                document.querySelector(".resultdesc").innerHTML += "Vector y is stable<br><br>";
            }
            else if(iter != 1 && vecStatus){
                document.querySelector(".resultdesc").innerHTML += "Vector y is converged<br><br>";
            }
            else{
                document.querySelector(".resultdesc").innerHTML += "Vector y is unstable<br><br>";
            }
        }
        else{
            if(iter == 1 && vecStatus){
                document.querySelector(".resultdesc").innerHTML += "Vector x" + (idx+1) + " is stable<br><br>";
            }
            else if(iter != 1 && vecStatus){
                document.querySelector(".resultdesc").innerHTML += "Vector x" + (idx+1) + " is converged<br><br>";
            }
            else{
                document.querySelector(".resultdesc").innerHTML += "Vector x" + (idx+1) + " is unstable<br><br>";
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
    
            document.querySelector(".resultdesc").innerHTML += "RESULT<br>";
            document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";

            var nomatching = false;
            for(var i=0; i<matchPattern.length; i++){
                if(matchPattern[i]){
                    document.querySelector(".resultdesc").innerHTML += "The test pattern you have matches with pattern " + (i+1) + "<br>";
                }
                nomatching |= matchPattern[i];
            }
            if(!nomatching){
                document.querySelector(".resultdesc").innerHTML += "The test pattern you have doesn\'t match with any of all training patterns<br>"; 
            }
            document.querySelector(".resultdesc").innerHTML += "<br>";
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
                document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                document.querySelector(".resultdesc").innerHTML += "ITERATION-" + itertest + "<br>";
                document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                U = findU(weightvector, Y, -1);
                Y = activation(U, prevTestVector[prevTestVector.length-1], -1);
                for(var i=0; i<Y.length; i++){
                    if(Y[i] == 1){
                        document.getElementById("elresult" + i ).style.backgroundColor = "#727376";
                    }
                    else{
                        document.getElementById("elresult" + i ).style.backgroundColor = "white";
                    }
                }
                val = validation(Y, prevTestVector, itertest, -1);
                statetest = val;
                nextitertest(statetest, weight, Y);
            }
            else{
                matchpattern(resulttraining, Y);
                document.querySelector('.barwrapper').style.animationIterationCount = "unset";
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
            prevTestVector.push(testVector[0]);
            itertest++;
            document.querySelector(".resultdesc").innerHTML += "\<br><b>CALCULATION OF TEST PATTERN</b><br>";
            document.querySelector(".resultdesc").innerHTML += "ITERATION-" + itertest + "<br>";
            document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
            transpose(testVector[0], -1);
            U = findU(weightvector, testVector[0], -1);
            Y = activation(U, prevTestVector[prevTestVector.length-1], -1);
            for(var i=0; i<Y.length; i++){
                if(Y[i] == 1){
                    document.getElementById("elresult" + i ).style.backgroundColor = "#727376";
                }
                else{
                    document.getElementById("elresult" + i ).style.backgroundColor = "white";
                }
            }
            val = validation(Y, prevTestVector, itertest, -1);
            statetest = val;
            nextitertest(statetest, weightvector, Y);
            document.querySelector('.barwrapper').style.animationIterationCount = "infinite";
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
                document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                document.querySelector(".resultdesc").innerHTML += "ITERATION-" + iter[i] + " FOR x" + (i+1) + "<br>";
                document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                if(iter[i] == 1){
                    transpose(x[i], i);
                    U = findU(weight, x[i], i);
                }
                else{
                    U = findU(weight, Y, i);
                }
                Y = activation(U, prevVector[i][prevVector[i].length-1], i);
                val = validation(Y, prevVector[i], iter[i], i);
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

    return{
        addDimension: function(ordo){
            for(var i=0; i < ordo.length; i++){
                dimension[i] = ordo[i];
            }
        },
        dimension: dimension,
        updateDimension: function(){
            for(var i=0; i < dimension.length; i++){
                dimension.shift();
            }
        },
        addX: function(data){
            var vector = [];
            data.forEach(function(e){
                vector.push(e.dataset.value);
            });
            x.push(vector);
        },
        addTest: function(data){
            var vector = [];
            data.forEach(function(e){
                vector.push(e.dataset.value);
            });
            while(testVector.length != 0){
                testVector.shift();
            }
            testVector.push(vector);
        },
        showX: x,
        showTestVector: testVector,
        deleteXY: function(){
            while(x.length != 0){
                x.shift();
            }
            while(testVector.length != 0){
                testVector.shift();
            }
        },
        start: function(){
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
            document.querySelector(".resultdesc").innerHTML = x.length > 1?"<b>CALCULATION OF TRAINING PATTERNS</b><br>":"<b>CALCULATION OF TRAINING PATTERN</b><br>";
            document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
            weightvector = weight(x);
            for(var i=0; i < x.length; i++){
                prevVector[i] = [];
                prevVector[i].push(x[i]);
                iter[i]++;
                document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                document.querySelector(".resultdesc").innerHTML += "ITERATION-" + iter[i] + " FOR x" + (i+1) + "<br>";
                document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                transpose(x[i], i);
                U = findU(weightvector, x[i], i);
                Y = activation(U, prevVector[i][prevVector[i].length-1], i);
                val = validation(Y, prevVector[i], iter[i], i);
                state[i] = val;
                nextiter(state, weightvector, Y);
                break;
            }
        }
    }
})();