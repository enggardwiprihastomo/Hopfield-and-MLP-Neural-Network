var NetController = (function(){
    var vectorStatus = [],
    vectorStatusTest = [],
    iter = [],
    iterTest = [],
    x = [],
    weightX = [],
    testVector = [],
    prevVector = [],
    prevTestVector = [],
    dimension = [],
    validationresult = [],
    validationresulttest = [],
    resultTraining = [],
    resultTest = [];

    var weight = function(input){
        var w = [], value,
            weight = [];
    
        for(var i=0; i < input.length; i++){
            w[i] = [];
            for(var j=0; j < input[i].length; j++){
                w[i][j]= [];
                for(var k=0; k < input[i].length; k++){
                    if(j==k){
                        w[i][j][k] = 0;	
                    }
                    else{
                        w[i][j][k] = input[i][j] * input[i][k];
                    }
                }
            }
        }
    
        for(var i=0; i < input[0].length; i++){
            weight[i] = [];
            for(var j=0; j < input[0].length; j++){
                value = 0;
                for(var k=0; k < input.length; k++){
                    value += w[k][j][i];
                    weight[i][j] = value / input.length;	
                }
            }
        }
        document.querySelector(".resultdesc").innerHTML += "Weight of vector X = [";
        for(var i=0; i<weight.length; i++){
            for(var j=0; j<weight[0].length;j++){
                if(i == weight.length-1 && j == weight[0].length-1){
                    document.querySelector(".resultdesc").innerHTML += weight[i][j];    
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += weight[i][j] + ", ";
                }
            }
        }
        document.querySelector(".resultdesc").innerHTML += "]<br><br>";
        return weight
    }
    
    var transpose = function(matrix, type = "training", status){
        var matrixt = [], matCols;
        matCols = !matrix[0].length?matrix.length:matrix[0].length,
        matRows = !matrix[0].length?1:matrix.length;
        for (var k = 0; k < matCols; k++) {
                matrixt[k] = [];
        }
    
        for(var i=0; i < matRows; i++){
            if(status != "result"){
                if(type=="training"){
                    document.querySelector(".resultdesc").innerHTML += "Transpose of vector x" + i + " = [";
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += "Transpose of vector y = [";
                }
            }
            for(var j=0; j < matCols;j++){
                if(!matrix[0].length){
                    matrixt[j][i] = matrix[j];
                }
                else{
                    matrixt[j][i] = matrix[i][j];
                }
                if(status != "result"){
                    if(j == matCols-1){
                        document.querySelector(".resultdesc").innerHTML += matrixt[j][i];    
                    }
                    else{
                        document.querySelector(".resultdesc").innerHTML += matrixt[j][i] + ", ";
                    }
                }
            }
            if(status != "result"){
                document.querySelector(".resultdesc").innerHTML += "]<sup>T</sup><br><br>";
            }
        }
        return matrixt;
    }
    
    var findU = function(weight, vector, type, x=-1){
    
        var weightRows = weight.length,
            weightCols = weight[0].length,
            vectorCols = vector[0].length,
            newMat = [];
    
        for(var i=0; i < weightRows; i++){
            newMat[i] = [];
            for(var j=0; j < vectorCols; j++){
                newMat[i][j] = 0;
                for(var k=0; k < weightCols; k++){
                    newMat[i][j] += weight[i][k] * vector[k][j];
                }
            }
        }
        
        if(x==-1){
            for(var i=0; i<vectorCols; i++){
                if(type=="training"){
                    document.querySelector(".resultdesc").innerHTML += "Result of weight*x" + i + " = [";
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += "Result of weight*y = [";
                }
                
                for(var j=0; j<weightCols; j++){
                    if(j == weightCols-1){
                        document.querySelector(".resultdesc").innerHTML += newMat[j][i];    
                    }
                    else{
                        document.querySelector(".resultdesc").innerHTML += newMat[j][i] + ", ";
                    }
                }
                document.querySelector(".resultdesc").innerHTML += "]<br><br>";
            }
        }
        else{
            if(type=="training"){
                document.querySelector(".resultdesc").innerHTML += "Result of weight*x" + x + " = [";
            }
            else{
                document.querySelector(".resultdesc").innerHTML += "Result of weight*y = [";
            }
            for(var j=0; j<weightCols; j++){
                if(j == weightCols-1){
                    document.querySelector(".resultdesc").innerHTML += newMat[j][x];    
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += newMat[j][x] + ", ";
                }
            }
            document.querySelector(".resultdesc").innerHTML += "]<br><br>";
        }
    
        return newMat;
    }
    
    
    var activation = function(vector, previousVector, type, x=-1){
        var vectorCols = vector[0].length, 
            vectorRows = vector.length;
    
        for(var i=0; i < vectorRows; i++){
            for(var j=0; j < vectorCols; j++){
                if(vector[i][j] > 0){
                    vector[i][j] = 1;
                }
                else if(vector[i][j] < 0){
                    vector[i][j] = -1;
                }
                else{
                    vector[i][j] = previousVector[previousVector.length-1][i][j];
                }
            }
        }
    
        if(x==-1){
            for(var i=0; i<vectorCols; i++){
                if(type=="training"){
                    document.querySelector(".resultdesc").innerHTML += "Result of Sign(weight*x" + i + ") = [";
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += "Result of Sign(weight*y) = [";
                }
                for(var j=0; j<vectorRows; j++){
                    if(j == vectorRows-1){
                        document.querySelector(".resultdesc").innerHTML += vector[j][i];    
                    }
                    else{
                        document.querySelector(".resultdesc").innerHTML += vector[j][i] + ", ";
                    }
                }
                document.querySelector(".resultdesc").innerHTML += "]<br><br>";
            }
        }
        else{
            if(type=="training"){
                document.querySelector(".resultdesc").innerHTML += "Result of Sign(weight*x" + x + ") = [";
            }
            else{
                document.querySelector(".resultdesc").innerHTML += "Result of Sign(weight*y) = [";
            }
            for(var j=0; j<vectorRows; j++){
                if(j == vectorRows-1){
                    document.querySelector(".resultdesc").innerHTML += vector[j][x];    
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += vector[j][x] + ", ";
                }
            }
            document.querySelector(".resultdesc").innerHTML += "]<br><br>";
        }
        return vector;
    }
    
    var validation = function(vector, previousVector, vecStatus, iteration, type, x=-1){
    var status,
        vectorCols = vector[0].length,
        vectorRows = vector.length,
        prevRows = previousVector.length;
        for(var i=0; i<prevRows; i++){
            vecStatus[i] = [];
            for(var j=0; j<vectorCols;j++){
                status = true;
                for(var k=0; k<vectorRows;k++){
                    if(vector[k][j] != previousVector[i][k][j]){
                        status = false;
                        break;
                    }
                }
                vecStatus[i][j] = status;
            }
        }
    
        var compareStatus = [];
    
        if(previousVector.length > 1){
            if(x==-1){
                for(var i=0; i<vecStatus[0].length; i++){
                    compareStatus[i] = false;
                    
                    for(var j=0; j<vecStatus.length; j++){
                        compareStatus[i] |= vecStatus[j][i];
                    }
                        if(iteration[i]==0 && compareStatus[i]){
                            document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + i + " is stable<br><br>":"Vector y is stable<br><br>";
                        }
                        else if(iteration[i]>0 && compareStatus[i]){
                            document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + i + " is converged<br><br>":"Vector y is converged<br><br>";
                        }
                        else{
                            document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + i + " is unstable<br><br>":"Vector y is unstable<br><br>";
                        }
                }
            }
            else{
                for(var i=0; i<vecStatus[0].length; i++){
                    for(var j=0; j<vecStatus.length; j++){
                        compareStatus[i] |= vecStatus[j][i];
                    }
                }
                if(iteration[x]==0 && compareStatus[x]){
                    document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + x + " is stable<br><br>":"Vector y is stable<br><br>";
                }
                else if(iteration[x]>0 && compareStatus[x]){
                    document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + x + " is converged<br><br>":"Vector y is converged<br><br>";
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + x + " is unstable<br><br>":"Vector y is unstable<br><br>";
                }
            }
        for(var i=0; i<compareStatus.length;i++){
            if(compareStatus[i] == 1){
                compareStatus[i] = true;
            }
            else{
                compareStatus[i] = false;
            }
        }
        return compareStatus;
        }
        else{
            if(x==-1){
                for(var i=0; i<vecStatus[0].length; i++){
                    if(iteration[i]==0 && vecStatus[0][i]){
                        document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + i + " is stable<br><br>":"Vector y is stable<br><br>";
                    }
                    else if(iteration[i]>0 && vecStatus[0][i]){
                        document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + i + " is converged<br><br>":"Vector y is converged<br><br>";
                    }
                    else{
                        document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + i + " is unstable<br><br>":"Vector y is unstable<br><br>";
                    }
                }
            }
            else{
                if(iteration[x]==0 && vecStatus[0][x]){
                    document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + x + " is stable<br><br>":"Vector y is stable<br><br>";
                }
                else if(iteration[x]>0 && vecStatus[0][x]){
                    document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + x + " is converged<br><br>":"Vector y is converged<br><br>";
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += type == "training"?"Vector x" + x + " is unstable<br><br>":"Vector y is unstable<br><br>";
                }
            }
        return vecStatus[0];
        }
    };

    var matchingPattern = function(training, test){
        var matchPattern = [];
        for(var i=0; i<training.length; i++){
            matchPattern[i] = true;
        }

        for(var i=0; i<training.length; i++){
            for(var j=0; j<training[i].length; j++){
                if(training[i][j] == test[0][j]){
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
                document.querySelector(".resultdesc").innerHTML += "The test pattern you have matches with x" + i + "<br>"; 
            }
            nomatching |= matchPattern[i];
        }
        if(!nomatching){
            document.querySelector(".resultdesc").innerHTML += "The test pattern you have doesn\'t match with any of all training patterns<br>"; 
        }
        document.querySelector(".resultdesc").innerHTML += "<br>";
    };

    var testdata = function(){
            while(prevTestVector.length != 0){
                prevTestVector.shift();
            }

            vectorStatusTest[0] = [];
            vectorStatusTest[0][0] = true;
            iterTest[0] = 0;
            document.querySelector(".resultdesc").innerHTML += "<br><br>CALCULATION OF TEST VECTOR<br>";
            document.querySelector(".resultdesc").innerHTML += "ITERATION-" + (iterTest[0]+1) + "<br>";
            document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
            transposeY = transpose(testVector, "test");
            prevTestVector.push(transposeY.slice());
            UTest = findU(weightX, transposeY, "test");
            YTest = activation(UTest, prevTestVector, "test");
            for(var i=0; i<YTest.length; i++){
                if(YTest[i] == 1){
                    document.getElementById("elresult" + i ).style.backgroundColor = "#727376";
                }
                else{
                    document.getElementById("elresult" + i ).style.backgroundColor = "white";
                }
            }
            validationresulttest = validation(YTest, prevTestVector, vectorStatusTest, iterTest, "test");
            nextitertest(validationresulttest, weightX, YTest);
    }

    var nextiter = function(state, weight, Y){
        setTimeout(function(state, weight, Y){
            if(prevVector.length > 1){
                prevVector.shift();
                prevVector.push(Y);
            }
            else{
                prevVector.push(Y);
            }
            for(var i=0; i < state.length; i++){
                if(!state[i]){
                    iter[i] += 1;
                    document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                    document.querySelector(".resultdesc").innerHTML += "ITERATION-" + (iter[i]+1) + " FOR X" + (i) + "<br>";
                    document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                    U = findU(weight, Y, "training", i);
                    Y = activation(U, prevVector, "training", i);
                    validationresult = validation(Y, prevVector, vectorStatus, iter, "training", i);
                    nextiter(validationresult, weight, Y);
                    break;
                }
            }
            var finalStatus = true;
            for(var i=0; i < state.length; i++){
                finalStatus &= state[i];
            }
            if(finalStatus){
                resultTraining = Y;
                testdata();
            }
        },500, state, weight, Y);
    }

    var nextitertest = function(stateTest, weight, YTest){
        setTimeout(function(stateTest, weight, YTest){
            if(prevTestVector.length > 1){
                prevTestVector.shift();
                prevTestVector.push(YTest);
            }
            else{
                prevTestVector.push(YTest);
            }
                if(!stateTest[0]){
                    iterTest[0] += 1;
                    document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                    document.querySelector(".resultdesc").innerHTML += "ITERATION-" + (iterTest[0]+1) + "<br>";
                    document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                    UTest = findU(weight, YTest, "test", 0);
                    YTest = activation(UTest, prevTestVector, "test", 0);
                    for(var j=0; j<YTest.length; j++){
                        if(YTest[j] == 1){
                            document.getElementById("elresult" + j ).style.backgroundColor = "#727376";
                        }
                        else{
                            document.getElementById("elresult" + j ).style.backgroundColor = "white";
                        }
                    }
                    validationresulttest = validation(YTest, prevTestVector, vectorStatusTest, iterTest, "test", 0);
                    nextitertest(validationresulttest, weight, YTest);
                    document.querySelector('.barwrapper').style.animationIterationCount = "infinite";
            }
            else{
                resultTest = YTest;
                matchingPattern(transpose(resultTraining, "", "result"), transpose(resultTest, "", "result"));
                document.querySelector('.barwrapper').style.animationIterationCount = "unset";
            }
        },500, stateTest, weight, YTest);
    }

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
                while(prevVector.length != 0){
                    prevVector.shift();
                }
                vectorStatus[0] = [];
                for(var i=0; i < x.length; i++){
                    vectorStatus[0][i] = true;
                    iter[i] = 0;
                }
                document.querySelector(".resultdesc").innerHTML = "ITERATION-" + (iter[0]+1) + " FOR ALL X<br>";
                document.querySelector(".resultdesc").innerHTML += "-----------------------------------------------------------------------------------<br>";
                transposeX = transpose(x);
                prevVector.push(transposeX.slice());
                weightX = weight(x);
                U = findU(weightX, transposeX, "training");
                Y = activation(U, prevVector, "training");
                validationresult = validation(Y, prevVector, vectorStatus, iter, "training");
                nextiter(validationresult, weightX, Y);
        }
    }
})();