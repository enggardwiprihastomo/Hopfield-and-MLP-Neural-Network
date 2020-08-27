var MainController = (function(UIController, NetController, TestController){
    var DOM = UIController.DOM, hiddenLayer = 0, DOMDelete;
    DOM.Menu.forEach(function(e){
        e.addEventListener("click", function(){
            DOM.Menu.forEach(function(e){
                if(e.childNodes[1].childNodes[0].className == "activesign"){
                    UIController.DeleteObj(e.childNodes[1].childNodes[0]);
                }
            });
            UIController.insertObj(e.childNodes[1], '<div class="activesign"></div>');
            if(e.id == "Training"){
                UIController.Display(DOM.Popup, 'flex');
                UIController.Display(DOM.Training, 'block');
                UIController.Display(DOM.Test, 'none');
                DOM.Threshold.focus();
            }
            else{
                UIController.Display(DOM.Popup, 'flex');
                UIController.Display(DOM.Test, 'block');
                UIController.Display(DOM.Training, 'none');
            }
        })
    });

    DOM.Popup.addEventListener("click", function(e){
        if(e.target.className == "popupwrapper"){
            if(e.target.children[2].style.display == "none" || e.target.children[2].style.display == ""){
                DOM.Menu.forEach(function(e){
                    if(e.childNodes[1].childNodes[0].className == "activesign"){
                        UIController.DeleteObj(e.childNodes[1].childNodes[0]);
                    }
                });
                UIController.Display(e.target, 'none');
                if(DOM.LoadTest.children[0].children.testset.files[0]){
                    DOM.Testset.value = "NO TEST SET SELECTED";
                    DOM.LoadTest.children[0].children.testset.files[0].name = "";
                }
                if(document.querySelector(".lowerdatatest")){
                    UIController.DeleteObj(document.querySelector(".lowerdatatest"));
                }
            }
        }
    });

    DOM.Load.addEventListener("change", function(e){
        DOM.Trainingset.value = e.target.files[0].name.toUpperCase();
        DOM.NetDiagram.style.height = "300px";
        UIController.Display( DOM.NetDiagram, 'block');
            if(e.target.files[0].name){
                var fr = new FileReader();
                var column = [], row;

                fr.onload = function(){
                    var inputs = [], outputs = [];
                    row = this.result.split("\n");
                    for(var i=0; i<row.length;i++){
                        column[i] = row[i].split(",");
                    }
                    for(var i=0;i<column.length;i++){
                        inputs[i] = [];
                        for(var j=0;j<column[i].length;j++){
                            if(j==column[i].length-1){
                                outputs.push(column[i][j]);
                            }
                            else{
                                inputs[i].push(column[i][j]);
                            }
                        }
                    }

                    function checkExist(number, classData){
                        var status = true;
                        for(var i=0; i<classData.length; i++){
                            if(number==classData[i]){
                                status = true;
                                break;
                            }
                            else{
                                status = false;
                            }
                        }

                        return status;
                    }

                    function preprocessInput(inputdata){
                        var dataTypeInput = [],
                        classDataInput = [],
                        dictConvertInput = [[],[]],
                        valueClassInput = [];

                        for(var i=0; i<inputdata.length; i++){
                            for(var j=0; j<inputdata[i].length; j++){
                                if(!checkDataType(inputdata[i][j])){
                                    inputdata[i][j] = parseFloat(inputdata[i][j]);
                                    dataTypeInput[j] = "N";
                                }
                                else{
                                    dataTypeInput[j] = "S";
                                }
                            }
                        }

                        for(var i=0; i<dataTypeInput.length; i++){
                            classDataInput[i] = [];
                            for(var j=0; j<inputdata.length; j++){
                                if(dataTypeInput[i] == "S"){
                                    if(classDataInput[i].length == 0){
                                        classDataInput[i].push(inputdata[j][i]);
                                    }
                                    else{
                                        if(!checkExist(inputdata[j][i], classDataInput[i])){
                                            classDataInput[i].push(inputdata[j][i]);
                                        }
                                    }
                                }
                            }
                        }

                        for(var i=0;i<classDataInput.length; i++){
                            valueClassInput[i] = [];
                            for(var j=0; j<classDataInput[i].length;j++){
                                valueClassInput[i][j] = j;
                            }
                        }

                        for(var i=0; i<classDataInput.length; i++){
                            for(var j=0; j<classDataInput[i].length; j++){
                                dictConvertInput[0].push(classDataInput[i][j]);
                                dictConvertInput[1].push(valueClassInput[i][j]);
                            }
                        }

                        for(var i=0; i<inputdata.length; i++){
                            for(var j=0; j<inputdata[i].length; j++){
                                if(dataTypeInput[j] == "S"){
                                    for(var k=0; k<classDataInput[j].length;k++){
                                        if(inputdata[i][j] == classDataInput[j][k]){
                                            inputdata[i][j] = valueClassInput[j][k];
                                        }
                                    }
                                }
                            }
                        }

                        return [inputdata, dictConvertInput];
                    }

                    function preprocessOutput(outputdata){
                        var dataTypeOutput,
                        classDataOutput = [],
                        convertOutput = [],
                        dictConvertOutput = [[],[]],
                        valueClassOutput = [];

                        for(var i=0; i<outputdata.length; i++){
                            if(!checkDataType(outputdata[i])){
                                outputdata[i] = parseFloat(outputdata[i]);
                                dataTypeOutput = "N";
                            }
                            else{
                                dataTypeOutput = "S";
                            }
                        }
                        
                        for(var i=0; i<outputdata.length; i++){
                            if(i==0){
                                classDataOutput.push(outputdata[i]);
                            }
                            else{
                                if(!checkExist(outputdata[i], classDataOutput)){
                                    classDataOutput.push(outputdata[i]);
                                }
                            }
                        }

                        for(var i=0;i<classDataOutput.length; i++){
                            valueClassOutput[i] = i;
                        }

                        if(classDataOutput.length <=2){
                            for(var i=0; i<outputdata.length; i++){
                                if(dataTypeOutput == "S"){
                                    for(var j=0; j<classDataOutput.length;j++){
                                        if(outputdata[i] == classDataOutput[j]){
                                            outputdata[i] = valueClassOutput[j];
                                        }
                                        dictConvertOutput[0][j] = classDataOutput[j];
                                        dictConvertOutput[1][j] = valueClassOutput[j];
                                    }
                                }
                                else{
                                    if((classDataOutput[0] != 0 && classDataOutput[1] != 1) || (classDataOutput[0] != 1 && classDataOutput[1] != 0)){
                                        for(var j=0; j<classDataOutput.length;j++){
                                            if(outputdata[i] == classDataOutput[j]){
                                                outputdata[i] = valueClassOutput[j];
                                            }
                                            dictConvertOutput[0][j] = classDataOutput[j];
                                            dictConvertOutput[1][j] = valueClassOutput[j];
                                        }
                                    }
                                }
                            }
                        }
                        else{
                            for(var i=0; i<classDataOutput.length; i++){
                                convertOutput[i]=[];
                                for(var j=0; j<classDataOutput.length;j++){
                                    if(i == j){
                                        convertOutput[i][j] = 1;
                                    }
                                    else{
                                        convertOutput[i][j] = 0;
                                    }
                                }
                                dictConvertOutput[0].push(classDataOutput[i]);
                                dictConvertOutput[1].push(convertOutput[i]);
                            }

                            for(var i=0; i<outputdata.length; i++){
                                for(var j=0; j<classDataOutput.length;j++){
                                    if(outputdata[i] == classDataOutput[j]){
                                        outputdata[i] = convertOutput[j];
                                    }
                                }
                            }
                        }
                        return [outputdata, classDataOutput, dictConvertOutput];
                    }

                    function standardization(inputdata){
                        var mean=[], standardDev=[], xi, xi2, varian, newinput=[];
                        for(var i=0;i<inputdata[0].length;i++){
                            mean[i] = 0;
                            standardDev[i] = 0;
                            xi=0;
                            xi2=0;
                            for(var j=0;j<inputdata.length;j++){
                                mean[i] += inputdata[j][i];
                                xi+=inputdata[j][i];
                                xi2+= Math.pow(inputdata[j][i],2);
                            }
                            xi = Math.pow(xi,2);
                            mean[i] = mean[i]/inputdata.length;
                            varian = ((inputdata.length*xi2)-xi)/(inputdata.length * (inputdata.length-1));
                            standardDev[i] = Math.sqrt(varian);
                        }

                        for(var i=0;i<inputdata.length;i++){
                            newinput[i]=[];
                            for(var j=0;j<inputdata[0].length;j++){
                                newinput[i][j] = (inputdata[i][j] - mean[j]) / standardDev[j];
                            }
                        }
                        return [newinput, mean, standardDev];
                    }

                    resultInput = preprocessInput(inputs);
                    resultOutput = preprocessOutput(outputs);
                    resultNormalization = standardization(resultInput[0]);
                    // console.log("Input: " + JSON.stringify(resultInput[0]));
                    // console.log("Standardized Input: " + JSON.stringify(resultNormalization[0]));
                    // console.log("Dict input: " + JSON.stringify(resultInput[1]));
                    // console.log("Output: " + JSON.stringify(resultOutput[0]));
                    // console.log("Class Output: " + JSON.stringify(resultOutput[1]));
                    // console.log("Dict output: " + JSON.stringify(resultOutput[2]));
                    NetController.setTrainingset(resultNormalization[0], resultOutput[0]);
                    NetController.setDataIn(resultInput[1], resultNormalization[1], resultNormalization[2]);
                    NetController.setDataOut(resultOutput[2])
                    UIController.insertIn(document.querySelector(".inputlayerwrapper"), resultInput[0][0].length);
                    UIController.insertOut(document.querySelector(".outputwrapper"), resultOutput[1].length);
                    UIController.setInfo(resultInput[0][0].length, resultOutput[1].length, resultInput[0].length);
                }
                fr.readAsText(e.target.files[0]);
            }
    });

    DOM.LoadTest.addEventListener("change", function(e){
        DOM.Testset.value = e.target.files[0].name.toUpperCase();
            if(e.target.files[0].name){
                var fr = new FileReader();
                var column = [], row;

                fr.onload = function(){
                    var inputs = [], outputs = [];
                    row = this.result.split("\n");
                    for(var i=0; i<row.length;i++){
                        column[i] = row[i].split(",");
                    }
                    for(var i=0;i<column.length;i++){
                        inputs[i] = [];
                        for(var j=0;j<column[i].length;j++){
                            if(j==column[i].length-1){
                                outputs.push(column[i][j]);
                            }
                            else{
                                inputs[i].push(column[i][j]);
                            }
                        }
                    }

                    dictIn = NetController.getDataIn();
                    dictOut = NetController.getDataOut();
                    inputs = preprocessInputReady(inputs, dictIn[0], dictIn[1], dictIn[2]);
                    outputs = preprocessOutputReady(outputs, dictOut);

                    /* console.log("Test");
                    console.log("Inputs: " + JSON.stringify(inputs));
                    console.log("Output: " + JSON.stringify(outputs)); */
                    TestController.setInput(inputs);
                    TestController.setOutput(outputs);
                }
                fr.readAsText(e.target.files[0]);
            }
    });

    DOM.LoadVal.addEventListener("change", function(e){
        DOM.Valset.value = e.target.files[0].name.toUpperCase();
            if(e.target.files[0].name){
                var fr = new FileReader();
                var column = [], row;

                fr.onload = function(){
                    var inputs = [], outputs = [];
                    row = this.result.split("\n");
                    for(var i=0; i<row.length;i++){
                        column[i] = row[i].split(",");
                    }
                    for(var i=0;i<column.length;i++){
                        inputs[i] = [];
                        for(var j=0;j<column[i].length;j++){
                            if(j==column[i].length-1){
                                outputs.push(column[i][j]);
                            }
                            else{
                                inputs[i].push(column[i][j]);
                            }
                        }
                    }

                    dictIn = NetController.getDataIn();
                    dictOut = NetController.getDataOut();
                    inputs = preprocessInputReady(inputs, dictIn[0], dictIn[1], dictIn[2]);
                    outputs = preprocessOutputReady(outputs, dictOut);
                    NetController.setValidationset(inputs, outputs);

                    // console.log("Validation");
                    // console.log("Inputs: " + JSON.stringify(inputs));
                    // console.log("Output: " + JSON.stringify(outputs));
                }
                fr.readAsText(e.target.files[0]);
            }
    });

    DOM.ProcessTest.addEventListener("click", function(){
        if(DOM.Testset.value == "NO TEST SET SELECTED"){
            UIController.Message("Please firstly select test set before testing");
        }
        else{
            var weights = NetController.getWeights(),
            hiddenlayer = NetController.getHiddenLayer(),
            errorThreshold = NetController.getThreshold(),
            dict = NetController.getDataOut(),
            correctData = [], incorrectData = [], classDataCorrect = [], classDataIncorrect = [], resultCorrect = [[],[]], resultIncorrect = [[],[]], countCorrect, countIncorrect;
            if(weights && weights.length != 0){
                var inputs = TestController.getInput();
                if((weights[0][0].length-1) == inputs[0].length){
                    var result  = TestController.startTest(weights, hiddenlayer, errorThreshold);
                    var obj = '<div class="lowerdatatest"><div class="testresultsection"><table><thead><tr><th>No</th><th>Actual Class</th><th>Result Class</th><th>State</th></tr></thead><tbody>';
                    var correct=0, incorrect=0, accuracy=0;
                    for(var i=0; i<result[0].length; i++){
                        obj += '<tr><td>' + (i+1) + '</td><td>' + result[0][i] + '</td><td>' + result[1][i] + '</td>';
                        if(result[2][i] == "T"){
                            obj += '<td class="teststate"><div class="iconcorrect"></div></td></tr>';
                            correctData.push(result[0][i]);
                            correct++;
                        }
                        else{
                            obj += '<td class="teststate"><div class="iconincorrect"></div></td></tr>';
                            incorrectData.push(result[0][i]);
                            incorrect++;
                        }
                    }

                    for(var i=0; i<correctData.length; i++){
                        if(i==0){
                            classDataCorrect.push(correctData[i]);
                        }
                        else{
                            if(!checkExist(correctData[i], classDataCorrect)){
                                classDataCorrect.push(correctData[i]);
                            }
                        }
                    }

                    for(var i=0; i<incorrectData.length; i++){
                        if(i==0){
                            classDataIncorrect.push(incorrectData[i]);
                        }
                        else{
                            if(!checkExist(incorrectData[i], classDataIncorrect)){
                                classDataIncorrect.push(incorrectData[i]);
                            }
                        }
                    }

                    for(i=0; i<classDataCorrect.length; i++){
                        countCorrect = 0;
                        for(j=0; j<correctData.length; j++){
                            if(classDataCorrect[i] == correctData[j]){
                                countCorrect++;
                            }
                        }
                        resultCorrect[0].push(classDataCorrect[i]);
                        resultCorrect[1].push(countCorrect);
                    }

                    for(i=0; i<classDataIncorrect.length; i++){
                        countIncorrect = 0;
                        for(j=0; j<incorrectData.length; j++){
                            if(classDataIncorrect[i] == incorrectData[j]){
                                countIncorrect++;
                            }
                        }
                        resultIncorrect[0].push(classDataIncorrect[i]);
                        resultIncorrect[1].push(countIncorrect);
                    }

                    
                    for(i=0; i<dict[1].length; i++){
                        for(j=0; j<resultCorrect[0].length; j++){
                            if(dict[1][i] == resultCorrect[0][j]){
                                resultCorrect[0][j] = resultCorrect[0][j] + " (" + dict[0][i] + ")";
                            }
                        }

                        for(j=0; j<resultIncorrect[0].length; j++){
                            if(dict[1][i] == resultIncorrect[0][j]){
                                resultIncorrect[0][j] = resultIncorrect[0][j] + " (" + dict[0][i] + ")";
                            }
                        }
                    }

                    function checkExist(number, classData){
                        var status = true;
                        for(var i=0; i<classData.length; i++){
                            if(number==classData[i]){
                                status = true;
                                break;
                            }
                            else{
                                status = false;
                            }
                        }

                        return status;
                    }

                    var objCorrect = '<table><thead><tr><th style="background-color: #A0DAE0">Qty</th><th style="background-color: #A0DAE0">Class</th><tr></thead><tbody>';
                    for(i=0; i<resultCorrect[0].length; i++){
                        objCorrect += '<tr><td>' + resultCorrect[1][i] + '</td><td>' + resultCorrect[0][i] + '</td></tr>';
                    }
                    objCorrect += '</tbody></table>';

                    var objIncorrect = '<table><thead><tr><th>Qty</th><th>Class</th><tr></thead><tbody>';
                    for(i=0; i<resultIncorrect[0].length; i++){
                        objIncorrect += '<tr><td>' + resultIncorrect[1][i] + '</td><td>' + resultIncorrect[0][i] + '</td></tr>';
                    }
                    objIncorrect += '</tbody></table>';
                    
                    accuracy = parseFloat((correct/result[0].length) * 100).toFixed(2);
                    obj += '</tbody><tfoot><tr><td colspan="2">Total test data</td><td>'+ result[0] .length+'</td></tr></tfoot></table></div><div class="testinformation"><div class="correctinfo"><div class="popupinfowrapper"><div class="iconcorrectinfo"></div><div class="popupinfo">' + objCorrect + '</div></div>Correct - '+ correct +'</div><div class="incorrectinfo"><div class="popupinfowrapper"><div class="iconincorrectinfo"></div><div class="popupinfo">' + objIncorrect + '</div></div>Incorrect - '+ incorrect +'</div><div class="resultinfo"><div class="iconresult"></div>Accuracy - '+ accuracy +'%</div></div></div>';
                    if(document.querySelector(".lowerdatatest")){
                        UIController.DeleteObj(document.querySelector(".lowerdatatest"));
                    }
                    UIController.insertObj(DOM.Test, obj, 'beforeend');
                }
                else{
                    UIController.Message("Number of inputs of test data you have doesn\'t match with number of inputs of trained network");
                }
            }
            else{
                UIController.Message("There is no trained network found. Please firsly train your network");
            }
        }
    });

    DOM.Add.addEventListener("click", function(){
        if(DOM.Trainingset.value == "NO TRAINING SET SELECTED"){
            UIController.Message("Please firstly select training set before adding hidden layer");
        }
        else{
            hiddenLayer++;
            var obj = '<div class="inputwrapper" id="hidden-' + hiddenLayer + '"><div class="inputfield"><div class="wrapperdelete"><div class="btn-showdelete"></div><div class="btn-delete" onclick="removeField(event)" id="' + hiddenLayer + '"><div class="btn-deleteimg"></div>Delete</div></div><input type="text" name="hiddenneuron" class="hiddenneuronfield" value="0" onkeyup="generateHiddenLayer()" id="' + hiddenLayer + '"></div></div>';
            UIController.insertObj(DOM.Input, obj, 'beforeend');
            UIController.AddHidden();
            UIController.AddHiddenInput();
        };
    });

    DOM.Reset.addEventListener("click", function(){
        DOM.Threshold.value = 0;
        DOM.LR.value = 0;
        DOM.Trainingset.value = "NO TRAINING SET SELECTED";
        UIController.DeleteMultipleObj(document.querySelectorAll(".inputwrapper"));
        DOM.HiddenInput[0].value = 0;
        hiddenLayer =  0;
        UIController.setInfo(0,0,0);
        UIController.setInfoHidden(document.querySelectorAll(".hiddenneuronfield"));
        UIController.insertIn(document.querySelector(".inputlayerwrapper"), 0);
        UIController.insertOut(document.querySelector(".outputwrapper"), 0);
        UIController.FreeObj(document.querySelectorAll(".hiddenwrapper"));
        if(document.querySelector(".chart")){
            UIController.DeleteObj(document.querySelector(".chart"));
        }
        UIController.Display(DOM.Curve, "block");
        UIController.Display(DOM.ResultBar, "flex");
        UIController.Display(DOM.NoResult, "block");
        UIController.Display(DOM.Result, "none");
        DOM.NetDiagram.style.height = "0px";
        NetController.clearData();
        setTimeout(function(){
            UIController.Display(DOM.NetDiagram, "none");
        }, 500);
    });

    DOM.Process.addEventListener("click", function(){
        input = NetController.getInput();
        if(DOM.Valset.value == "NO VALIDATION SET SELECTED"){
            UIController.Message("Please firstly select validation set before training the network");
        }
        else{
            if(input[0][0].length == input[1][0].length){
                if(DOM.LR.value && DOM.LR.value != 0){
                    var hiddenLayer = UIController.GetHiddenLayer(document.querySelectorAll(".hiddenneuronfield"));
                    UIController.Display(DOM.Training, "none");
                    UIController.Display(DOM.Loading, "block");
                    UIController.DeleteObj(document.querySelector(".activesign"));
                    NetController.setData(parseFloat(DOM.Threshold.value), parseFloat(DOM.LR.value), hiddenLayer);
                    // NetController.printout();
                    UIController.clearTime();
                    UIController.getTime(new Date);
                    setTimeout(function(){
                        netresult = NetController.MLP();
                        UIController.DisplayResult(netresult);
                    },500);
                }
                else{
                    UIController.Message("Learning rate cannot be 0");
                }
            }
            else{
                UIController.Message("Training and validation sets are different dataset. Please select similar dataset for both");
            }
        }
    });
    
})(UIController, NetController, TestController);

var generateHiddenLayer = function(){
    UIController.insertHidden(document.querySelectorAll(".hiddenneuronfield"));
    UIController.setInfoHidden(document.querySelectorAll(".hiddenneuronfield"));
}

var removeField = function(event){
    UIController.deleteHidden(event.target.id);
    UIController.DeleteObj(document.getElementById("hidden-" + event.target.id));
    UIController.setInfoHidden(document.querySelectorAll(".hiddenneuronfield"));
}

var checkDataType = function(data){
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var status = false;
    for(var i=0; i<letters.length; i++){
        for(var j=0; j<data.length; j++){
            if(letters[i] == data[j]){
                status = true;
                break;
            }
        }
    }
    return status;
}

var preprocessInputReady = function(inputdata, dict, mean, stdDev){
    var dataTypeInput = [];

    for(var i=0; i<inputdata.length; i++){
        for(var j=0; j<inputdata[i].length; j++){
            if(!checkDataType(inputdata[i][j])){
                inputdata[i][j] = parseFloat(inputdata[i][j]);
                dataTypeInput[j] = "N";
            }
            else{
                dataTypeInput[j] = "S";
            }
        }
    }

    for(var i=0; i<inputdata.length; i++){
        for(var j=0; j<inputdata[i].length; j++){
            if(dataTypeInput[j] == "S"){
                for(var k=0; k<dict[0].length;k++){
                    if(inputdata[i][j] == dict[0][k]){
                        inputdata[i][j] = dict[1][k];
                    }
                }
            }
        }
    }

    for(var i=0;i<inputdata.length;i++){
        for(var j=0;j<inputdata[0].length;j++){
            inputdata[i][j] = (inputdata[i][j] - mean[j]) / stdDev[j];
        }
    }
    return inputdata;
}

var preprocessOutputReady = function(outputdata, dict){
    
    for(var i=0; i<outputdata.length; i++){
        if(!checkDataType(outputdata[i])){
            outputdata[i] = parseFloat(outputdata[i]);
        }
    }
    
    for(var i=0; i<outputdata.length; i++){
        for(var j=0; j<dict[0].length; j++){
            if(outputdata[i] == dict[0][j]){
                outputdata[i] = dict[1][j];
            }
        }
    }

    return outputdata;
}