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
    
    var transpose = function(matrix){
        var matrixt = [], matCols;
        matCols = !matrix[0].length?matrix.length:matrix[0].length,
        matRows = !matrix[0].length?1:matrix.length;
        for (var k = 0; k < matCols; k++) {
                matrixt[k] = [];
        }
    
        for(var i=0; i < matRows; i++){
            document.querySelector(".resultdesc").innerHTML += "Transpose of vector x" + i + " = [";
            for(var j=0; j < matCols;j++){
                if(!matrix[0].length){
                    matrixt[j][i] = matrix[j];
                }
                else{
                    matrixt[j][i] = matrix[i][j];
                }

                if(j == matCols-1){
                    document.querySelector(".resultdesc").innerHTML += matrixt[j][i];    
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += matrixt[j][i] + ", ";
                }
            }
            document.querySelector(".resultdesc").innerHTML += "]<sup>T</sup><br><br>";
        }
        return matrixt;
    }

    var transposeResult = function(matrix){
        var matrixt = [], matCols;
        matCols = !matrix[0].length?matrix.length:matrix[0].length,
        matRows = !matrix[0].length?1:matrix.length;
        for (var k = 0; k < matCols; k++) {
                matrixt[k] = [];
        }
    
        for(var i=0; i < matRows; i++){
            for(var j=0; j < matCols;j++){
                if(!matrix[0].length){
                    matrixt[j][i] = matrix[j];
                }
                else{
                    matrixt[j][i] = matrix[i][j];
                }
            }
        }
        return matrixt;
    }
    
    var findU = function(weight, vector, x=-1){
    
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
                document.querySelector(".resultdesc").innerHTML += "Result of weight*x" + i + " = [";
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
            document.querySelector(".resultdesc").innerHTML += "Result of weight*x" + x + " = [";
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
    
    
    var activation = function(vector, previousVector, x=-1){
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
                document.querySelector(".resultdesc").innerHTML += "Result of Sign(weight*x" + i + ") = [";
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
            document.querySelector(".resultdesc").innerHTML += "Result of Sign(weight*x" + x + ") = [";
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
    
    var validation = function(vector, previousVector, vecStatus, iteration, x=-1){
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
                            document.querySelector(".resultdesc").innerHTML += "Vector x" + i + " is stable<br><br>";
                        }
                        else if(iteration[i]>0 && compareStatus[i]){
                            document.querySelector(".resultdesc").innerHTML += "Vector x" + i + " is converged<br><br>";
                        }
                        else{
                            document.querySelector(".resultdesc").innerHTML += "Vector x" + i + " is unstable<br><br>";
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
                    document.querySelector(".resultdesc").innerHTML += "Vector x" + x + " is stable<br><br>";
                }
                else if(iteration[x]>0 && compareStatus[x]){
                    document.querySelector(".resultdesc").innerHTML += "Vector x" + x + " is converged<br><br>";
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += "Vector x" + x + " is unstable<br><br>";
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
                        document.querySelector(".resultdesc").innerHTML += "Vector x" + i + " is stable<br><br>";
                    }
                    else if(iteration[i]>0 && vecStatus[0][i]){
                        document.querySelector(".resultdesc").innerHTML += "Vector x" + i + " is converged<br><br>";
                    }
                    else{
                        document.querySelector(".resultdesc").innerHTML += "Vector x" + i + " is unstable<br><br>";
                    }
                }
            }
            else{
                if(iteration[x]==0 && vecStatus[0][x]){
                    document.querySelector(".resultdesc").innerHTML += "Vector x" + x + " is stable<br><br>";
                }
                else if(iteration[x]>0 && vecStatus[0][x]){
                    document.querySelector(".resultdesc").innerHTML += "Vector x" + x + " is converged<br><br>";
                }
                else{
                    document.querySelector(".resultdesc").innerHTML += "Vector x" + x + " is unstable<br><br>";
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
            transposeY = transpose(testVector);
            prevTestVector.push(transposeY.slice());
            UTest = findU(weightX, transposeY);
            YTest = activation(UTest, prevTestVector);
            for(var i=0; i<YTest.length; i++){
                if(YTest[i] == 1){
                    document.getElementById("elresult" + i ).style.backgroundColor = "#727376";
                }
                else{
                    document.getElementById("elresult" + i ).style.backgroundColor = "white";
                }
            }
            validationresulttest = validation(YTest, prevTestVector, vectorStatusTest, iterTest);
            console.log(validationresulttest);
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
                    U = findU(weight, Y, i);
                    Y = activation(U, prevVector, i);
                    validationresult = validation(Y, prevVector, vectorStatus, iter, i);
                    console.log(validationresult);
                    nextiter(validationresult, weight, Y);
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
                    UTest = findU(weight, YTest, 0);
                    YTest = activation(UTest, prevTestVector, 0);
                    for(var j=0; j<YTest.length; j++){
                        if(YTest[j] == 1){
                            document.getElementById("elresult" + j ).style.backgroundColor = "#727376";
                        }
                        else{
                            document.getElementById("elresult" + j ).style.backgroundColor = "white";
                        }
                    }
                    validationresulttest = validation(YTest, prevTestVector, vectorStatusTest, iterTest, 0);
                    console.log(validationresulttest);
                    nextitertest(validationresulttest, weight, YTest);
                    document.querySelector('.barwrapper').style.animationIterationCount = "infinite";
            }
            else{
                resultTest = YTest;
                matchingPattern(transposeResult(resultTraining), transposeResult(resultTest));
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
                U = findU(weightX, transposeX);
                Y = activation(U, prevVector);
                validationresult = validation(Y, prevVector, vectorStatus, iter);
                console.log(validationresult);
                nextiter(validationresult, weightX, Y);
        }
    }
})();

var UIController = (function(){
    DOM = {
        BTNOK: document.querySelector(".btn-ok"),
        BTNRESET: document.querySelector(".btn-reset"),
        Dimension: document.querySelectorAll('.dimension'),
        Body: document.querySelector('body'),
        Wrapper: document.querySelector('.wrapper'),
        Pattern: document.querySelector('.pattern'),
        Training: document.querySelector('.training'),
        DOMTest: document.querySelector('.test'),
        VectorFile: document.querySelector(".vectorFile")
    };
    var statusPattern = false;

    return{
        DOM: DOM,
        Message: function(text){
            DOM.Body.insertAdjacentHTML('afterbegin', '<div class="popupwrapper"><div class="message">' + text + '</div></div>');
        },
        createPattern: function(dimension){
            if(dimension){
                var numElement, content;
                numElement = dimension[0] * dimension[1];
                content = '<div class="content"><div class="poscenter"><div class="inputpattern">';
                for(var i=0; i<numElement;i++){
                    content += '<div class="element" id="' + i + '" data-value="-1" style="background-color: white;"></div>';
                }
                content += '</div></div><div><p class="iterPattern">PATTERN 1</p></div><div class="btn-section"><div class="btn-add"><img src="img/add.png" data-type="btn-add"></div><div class="btn-sync"><img src="img/networks.png" data-type="btn-sync"></div></div>';
                DOM.Wrapper.insertAdjacentHTML('afterbegin', content);
                document.querySelector('.inputpattern').style.height = dimension[0] * 30 + 'px';
                document.querySelector('.inputpattern').style.width = dimension[1] * 30 + 'px';
                if(dimension[0] * 30 > 150){
                    DOM.Pattern.style.position = "static";
                }
                else{
                    DOM.Pattern.style.position = "absolute";
                }
                this.statusPattern = true;

                if(document.querySelector(".nocontent")){
                    this.removeElement('nocontent');
                }
            }
            else{
                if(!document.querySelector(".nocontent")){
                    var content;
                    content = '<div class="nocontent"><div class="poscenter"><div class="blue"></div><div class="green"></div><div class="yellow"></div></div></div>';
                    DOM.Wrapper.insertAdjacentHTML('afterbegin', content);
                    
                }
            }
        },
        statusPattern: this.statusPattern,
        removeElement: function(name){
            var el = document.querySelectorAll("." + name);
            el.forEach(function(e){
                e.parentNode.removeChild(e);
            });
        },
        updatePattern: function(dimension, x){
            var numElement;
            numElement = dimension[0] * dimension[1];
            for(var i=0; i<numElement;i++){
                document.getElementById(i).style.backgroundColor = "white";
                document.getElementById(i).dataset.value = -1;
            }
            document.querySelector('.iterPattern').textContent = 'PATTERN ' + parseInt(x.length+1);
        },
        loadPattern: function(elements, x){
            for(var i=0; i<elements.length;i++){
                if(elements[i] == 1){
                    document.getElementById(i).style.backgroundColor = "#727376";
                    document.getElementById(i).dataset.value = 1;
                }
                else{
                    document.getElementById(i).style.backgroundColor = "white";
                    document.getElementById(i).dataset.value = -1;
                }
            }
            document.querySelector('.iterPattern').textContent = 'PATTERN ' + parseInt(x.length+1);
        },
        clearDimension: function(){
            DOM.Dimension.forEach(function(e){
                e.value = '';
            });
        },
        createTraining: function(elements, dimension, x){
            if(x.length != 0){
                var content, i=0;
                content = '<div class="wrappertrainpattern"><div class="displaypattern" id="training' + x.length + '">';
                elements.forEach(function(e){
                    content += '<div class="smallelement" id="training' + i + 'pat' + x.length + '"></div>';
                    i++;
                });
                content += '</div></div>';
                DOM.Training.insertAdjacentHTML('beforeend', content);
                DOM.Training.style.justifyContent = "flex-start";
                document.getElementById('training'+ x.length).style.height = dimension[0] * 15 + 'px';
                document.getElementById('training'+ x.length).style.width = dimension[1] * 15 + 'px';
                i=0;
                elements.forEach(function(e){
                    if(e.dataset.value == -1){
                        document.getElementById('training'+i+'pat'+x.length).style.backgroundColor = 'white';
                    }
                    else{
                        document.getElementById('training'+i+'pat'+x.length).style.backgroundColor = '#727376';
                    }
                    i++;
                });

                if(document.querySelector(".wrappertraining")){
                    this.removeElement('wrappertraining');
                }

                if(dimension[0] * 15 > 200){
                    DOM.Training.style.alignItems = 'flex-start';
                }
                else{
                    DOM.Training.style.alignItems = 'center';
                }
            }
            else{
                if(!document.querySelector(".wrappertraining")){
                    var content;
                    content = '<div class="wrappertraining"><div class="nopattern"><div class="patternimg"><img src="img/train.png"></div><div class="desc">NO TRAINING PATTERN FOUND</div></div></div>';
                    DOM.Training.insertAdjacentHTML('afterbegin', content);
                    DOM.Training.style.justifyContent = "center";
                    
                }
            }
        },

        createTest: function(elements, dimension, y){
            if(y.length != 0){
                var content, i=0;
                if(document.querySelector(".wrappertestpattern")){
                    this.removeElement("wrappertestpattern");
                }
                content = '<div class="wrappertestpattern"><div class="displaypattern" id="test">';
                elements.forEach(function(e){
                    content += '<div class="smallelement" id="eltest' + i + '"></div>';
                    i++;
                });
                content += '</div></div>';
                DOM.DOMTest.insertAdjacentHTML('beforeend', content);
                document.getElementById('test').style.height = dimension[0] * 15 + 'px';
                document.getElementById('test').style.width = dimension[1] * 15 + 'px';
                i=0;
                elements.forEach(function(e){
                    if(e.dataset.value == -1){
                        document.getElementById('eltest'+i).style.backgroundColor = 'white';
                    }
                    else{
                        document.getElementById('eltest'+i).style.backgroundColor = '#727376';
                    }
                    i++;
                });

                if(document.querySelector(".wrappertest")){
                    this.removeElement('wrappertest');
                }

                if(dimension[0] * 15 > 200){
                    DOM.DOMTest.style.alignItems = 'flex-start';
                }
                else{
                    DOM.DOMTest.style.alignItems = 'center';
                }

                if(dimension[1] * 15 > 200){
                    DOM.DOMTest.style.justifyContent = 'flex-start';
                }
                else{
                    DOM.DOMTest.style.justifyContent = 'center';
                }
            }
            else{
                if(!document.querySelector(".wrappertest")){
                    var content;
                    content = '<div class="wrappertest"><div class="nopattern"><div class="patternimg"><img src="img/test.png"></div><div class="desc">NO TEST PATTERN FOUND</div></div></div>';
                    DOM.DOMTest.insertAdjacentHTML('afterbegin', content);
                    DOM.DOMTest.style.alignItems = "center";
                    DOM.DOMTest.style.justifyContent = "center";
                }
            }
        },

        createResult: function(elements, dimension, y){
                var content, i=0;
                if(document.querySelector(".wrapperresultpattern")){
                    this.removeElement("wrapperresultpattern");
                }
                content = '<div class="popupwrapper"><div class="resultwrapper"><div class="resultpattern"><div class="wrapperresultpattern"><div class="displaypattern" id="resultpat">';
                elements.forEach(function(e){
                    content += '<div class="elementresult" id="elresult' + i + '"></div>';
                    i++;
                });
                content += '</div></div></div><div class="resultdesc"></div><div class="barwrapper"><div class="bluebar"></div><div class="greenbar"></div><div class="yellowbar"></div></div></div></div>';
                DOM.Body.insertAdjacentHTML('afterbegin', content);
                document.getElementById('resultpat').style.height = dimension[0] * 30 + 'px';
                document.getElementById('resultpat').style.width = dimension[1] * 30 + 'px';
                i=0;
                elements.forEach(function(e){
                    if(e.dataset.value == -1){
                        document.getElementById('elresult'+i).style.backgroundColor = 'white';
                    }
                    else{
                        document.getElementById('elresult'+i).style.backgroundColor = '#727376';
                    }
                    i++;
                });
                if(dimension[0] * 30 > 300){
                    document.querySelector('.resultpattern').style.alignItems = 'flex-start';
                }
                else{
                    document.querySelector('.resultpattern').style.alignItems = 'center';
                }

                if(dimension[1] * 30 > 300){
                    document.querySelector('.resultpattern').style.justifyContent = 'flex-start';
                }
                else{
                    document.querySelector('.resultpattern').style.justifyContent = 'center';
                }
        },

        setPatternValue: function(element){
            if(document.getElementById(element.id).style.backgroundColor == "white"){
                document.getElementById(element.id).style.backgroundColor = "#727376";
                element.dataset.value = 1;
            }
            else{
                document.getElementById(element.id).style.backgroundColor = "white";
                element.dataset.value = -1;
            }
        },
        disablestatus: function(){
            this.statusPattern = false;
        },
        isNumber: function(event){
            var charCode = (event.which) ? event.which : event.keyCode;
            return !(charCode > 31 && (charCode < 48 || charCode > 57));
        }
    }
})();

var MainController = (function(UIController, NetController){
    DOM = UIController.DOM;

    DOM.Body.addEventListener('click', function(e){
    if(e.target.className == "popupwrapper"){
        UIController.removeElement(e.target.className);
    }
    else if(e.target.className == "btn-ok"){
        var dimension = [];
        DOM.Dimension.forEach(function(e){
            if(e.value){
                if(e.value != 0){
                    dimension.push(e.value);
                }
            }
        });
        if(dimension.length < 2){
            UIController.Message("Please enter proper dimension value");
        }
        else{
            if(UIController.statusPattern){
                UIController.Message("Please press reset first to create new pattern dimension");
            }
            else{
                UIController.createPattern(dimension);
                NetController.addDimension(dimension);
            }
        }
    }
    else if(e.target.id && e.target.className == "element"){
        UIController.setPatternValue(e.target);
    }
    else if(e.target.className == "btn-reset"){
        UIController.removeElement("content");
        UIController.removeElement("displaypattern");
        UIController.clearDimension();
        NetController.updateDimension();
        NetController.deleteXY();
        UIController.disablestatus();
        UIController.createTraining(0, 0, NetController.showX);
        UIController.createTest(0, 0, NetController.showTestVector);
        UIController.createPattern();
        DOM.Dimension[0].focus();
    }
    else if(e.target.className == "btn-add" || e.target.dataset.type == "btn-add"){
        NetController.addX(document.querySelectorAll(".element"));
        UIController.createTraining(document.querySelectorAll(".element"), NetController.dimension, NetController.showX);
        UIController.updatePattern(NetController.dimension, NetController.showX);
    }
    else if(e.target.className == "btn-sync" || e.target.dataset.type == "btn-sync"){
        if(NetController.showX.length > 0){
            NetController.addTest(document.querySelectorAll(".element"));
            UIController.createTest(document.querySelectorAll(".element"), NetController.dimension, NetController.showTestVector);
            UIController.createResult(document.querySelectorAll(".element"), NetController.dimension, NetController.showTestVector);
            UIController.updatePattern(NetController.dimension, NetController.showX);
            NetController.start();
        }
        else{
            UIController.Message("Please insert at least one training pattern before testing your pattern");
        }
    }
    });

    DOM.VectorFile.addEventListener('change', function(e){
        var vectorfile = [], row, column = [];
        if(e.target.files[0].name){
            var fr = new FileReader();
            fr.onload = function(){
                row = this.result.split(";");
                for(var i=0; i< row.length-1; i++){
                    column[i] = row[i].split(",");
                }
                for(var i=0; i < column.length; i++){
                    for(var j=0; j < column[0].length; j++){
                        vectorfile.push(parseInt(column[i][j]));
                    }
                }

                var dimension = [];
                dimension.push(column.length);
                dimension.push(column[0].length);
                if(NetController.showX.length > 0){
                    if(dimension[0] == NetController.dimension[0] && dimension[1] == NetController.dimension[1]){
                        UIController.loadPattern(vectorfile, NetController.showX);
                    }
                    else{
                        UIController.Message("The dimension of file that you insert is not match with existed pattern's dimension, please insert proper dimension or press reset first to create new pattern dimension")
                    }
                }
                else{
                    if(UIController.statusPattern){
                        UIController.Message("Please press reset first to create new pattern dimension");
                    }
                    else{
                        UIController.createPattern(dimension);
                        UIController.loadPattern(vectorfile, NetController.showX);
                        NetController.addDimension(dimension);
                    }
                }
            }
            fr.readAsText(e.target.files[0]);
        }
    });

    return {
		init : function(){
            DOM.Dimension[0].focus();
            UIController.createTraining(0, 0, NetController.showX);
            UIController.createTest(0, 0, NetController.showTestVector);
            UIController.createPattern();
		}
	}
})(UIController, NetController)

MainController.init();