var NetController = (function(){
    var errorThreshold,
    learningRate,
    hiddenLayer,
    weights,
    maxEpoch = 50000,
    trainingset = {inputs: [],target: []},
    validationset = {inputs: [],target: []},
    mean,
    standardDev,
    dictInput,
    dictOutput,
    beta = 0.01,
    gamma = 0.1,
    oldBigDelta = [];

    var setInitOldBigDelta = function(weights){
        for(var i=weights.length-1; i>=0;i--){
            oldBigDelta[i] = [];
            for(var j=0; j<weights[i].length; j++){
                oldBigDelta[i][j] = [];
                for(var k=0; k<weights[i][j].length; k++){
                    oldBigDelta[i][j][k] = 0;
                }
            }
        }
    }

    var increaseLR = function(learningRate){
        return learningRate + 0.05;
    }

    var randomUniform = function(a,b){
        return a + (b-a) * Math.random();
    }
    
    var summationFunc = function(inputs, weights){
        var sum = 0;
        var bias_idx = weights.length-1;
        for(var i=0; i<inputs.length;i++){
            sum+=inputs[i]*weights[i];
        }
        sum += weights[bias_idx];
        return sum;
    }
    
    var activationFunc = function(summation){
        return 1/(1 + Math.exp(-1*summation));
    }
    
    var forwardPass = function(inputs, weights){
        var summation = summationFunc(inputs, weights);
        var output = activationFunc(summation);
        return output;
    }
    
    var calculateError = function(target, actual){
        var error = target - actual;
        return error;
    }
    
    var updateWeights = function(inputs, calcResult, weights, learningRate, error){
        // console.log("Error: " + JSON.stringify(error));
        var smallDelta = [];
        for(var i=calcResult.length-1; i>=0;i--){
            smallDelta[i]=[];
            if(i==calcResult.length-1){
                for(var j=0; j<calcResult[i].length;j++){
                    if(calcResult[i].length == 1){
                        smallDelta[i][j] = error * (calcResult[i][j]*(1-calcResult[i][j]));
                    }
                    else{
                        smallDelta[i][j] = error[j] * (calcResult[i][j]*(1-calcResult[i][j]));
                    }
                }   
            }
            else{
                for(var k=0; k<calcResult[i].length;k++){
                    smallDelta[i][k] = 0;
                    for(var j=0; j<calcResult[i+1].length;j++){
                        smallDelta[i][k] += smallDelta[i+1][j] * weights[i+1][j][k];
                    }
                    smallDelta[i][k] = smallDelta[i][k] * (calcResult[i][k]*(1-calcResult[i][k]));
                }
            }
        }
        // console.log("small delta: " + JSON.stringify(smallDelta));

        /* var newError = 0;
        if(calcResult[calcResult.length-1].length == 1){
            newError = error;
        }
        else{
            for(var i=0; i<calcResult[calcResult.length-1].length;i++){
                newError+=error[i];
            }
            newError = newError/error.length;
        } */

        var bigDelta = [];
        for(var i=weights.length-1; i>=0;i--){
            bigDelta[i] = [];
            for(var j=0; j<weights[i].length; j++){
                bigDelta[i][j] = [];
                for(var k=0; k<weights[i][j].length; k++){
                    if(i==0){
                        if(k==weights[i][j].length-1){
                            bigDelta[i][j][k] = learningRate * smallDelta[i][j];
                            
                            /* bigDelta[i][j][k] = (learningRate * smallDelta[i][j]) + (beta * oldBigDelta[i][j][k]) + (gamma * newError);
                            oldBigDelta[i][j][k] = bigDelta[i][j][k]; */
                        }
                        else{
                            bigDelta[i][j][k] = learningRate * smallDelta[i][j] * inputs[k];

                            /* bigDelta[i][j][k] = (learningRate * smallDelta[i][j] * inputs[k]) + (beta * oldBigDelta[i][j][k]) + (gamma * newError);
                            oldBigDelta[i][j][k] = bigDelta[i][j][k]; */
                        }
                    }
                    else{
                        if(k==weights[i][j].length-1){
                            bigDelta[i][j][k] = learningRate * smallDelta[i][j];
                            
                            /* bigDelta[i][j][k] = (learningRate * smallDelta[i][j]) + (beta * oldBigDelta[i][j][k]) + (gamma * newError);
                            oldBigDelta[i][j][k] = bigDelta[i][j][k]; */
                        }
                        else{
                            bigDelta[i][j][k] = learningRate * smallDelta[i][j] * calcResult[i-1][k];
                            
                            /* bigDelta[i][j][k] = (learningRate * smallDelta[i][j] * calcResult[i-1][k]) + (beta * oldBigDelta[i][j][k]) + (gamma * newError);
                            oldBigDelta[i][j][k] = bigDelta[i][j][k]; */
                        }
                    }
                }
            }
        }
        // console.log("big delta: " + JSON.stringify(bigDelta));
        
        for(var i=0; i<weights.length; i++){
            for(var j=0; j<weights[i].length; j++){
                for(var k=0; k<weights[i][j].length; k++){
                    weights[i][j][k] = weights[i][j][k] + bigDelta[i][j][k];
                }
            }
        }
        // console.log("New weights " + JSON.stringify(weights));
        return weights;
    }
    
    var learn = function(inputs, target, weights, hiddenLayer, learningRate){
        var calcResult = [];
        if(hiddenLayer[0] != 0){
            for(var i=0; i<hiddenLayer[0]; i++){
                calcResult[i] = [];
                for(var j=0; j<hiddenLayer[1][i]; j++){
                    if(i==0){
                        calcResult[i][j] = forwardPass(inputs,weights[i][j]);
                    }
                    else{
                        calcResult[i][j] = forwardPass(calcResult[i-1],weights[i][j]);
                    }
                }
            }
            calcResult.push([]);
            for(var j=0; j<weights[weights.length-1].length; j++){
                calcResult[hiddenLayer[0]].push(forwardPass(calcResult[hiddenLayer[0]-1], weights[weights.length-1][j]));
            }
            // console.log("Calculation Result " + JSON.stringify(calcResult));
        }
        else{
            calcResult.push([]);
            for(var i=0; i<weights[weights.length-1].length; i++){
                calcResult[hiddenLayer[0]].push(forwardPass(inputs, weights[weights.length-1][i]));
            }
        }
        // console.log("f(net): " + JSON.stringify(calcResult));
        var totalError = 0;
        if(calcResult[hiddenLayer[0]].length>1){
            var error = [];
            for(var i=0; i<calcResult[hiddenLayer[0]].length;i++){
                error[i] = calculateError(target[i], calcResult[hiddenLayer[0]][i]);
                totalError += Math.abs(error[i]);
            }
            totalError = totalError/calcResult[hiddenLayer[0]].length;
        }
        else{
            var error = calculateError(target, calcResult[hiddenLayer[0]][0]);
            totalError += Math.abs(error);
        }
        var new_weights = updateWeights(inputs, calcResult, weights, learningRate, error);
        return [new_weights, totalError];
    }

    var learnValidation = function(inputs, target, weights, hiddenLayer){
        var calcResult = [];
        if(hiddenLayer[0] != 0){
            for(var i=0; i<hiddenLayer[0]; i++){
                calcResult[i] = [];
                for(var j=0; j<hiddenLayer[1][i]; j++){
                    if(i==0){
                        calcResult[i][j] = forwardPass(inputs,weights[i][j]);
                    }
                    else{
                        calcResult[i][j] = forwardPass(calcResult[i-1],weights[i][j]);
                    }
                }
            }
            calcResult.push([]);
            for(var j=0; j<weights[weights.length-1].length; j++){
                calcResult[hiddenLayer[0]].push(forwardPass(calcResult[hiddenLayer[0]-1], weights[weights.length-1][j]));
            }
        }
        else{
            calcResult.push([]);
            for(var i=0; i<weights[weights.length-1].length; i++){
                calcResult[hiddenLayer[0]].push(forwardPass(inputs, weights[weights.length-1][i]));
            }
        }
        var totalError = 0;
        if(calcResult[hiddenLayer[0]].length>1){
            var error = [];
            for(var i=0; i<calcResult[hiddenLayer[0]].length;i++){
                error[i] = calculateError(target[i], calcResult[hiddenLayer[0]][i]);
                totalError += Math.abs(error[i]);
            }
            totalError = totalError/calcResult[hiddenLayer[0]].length;
        }
        else{
            var error = calculateError(target, calcResult[hiddenLayer[0]][0]);
            totalError += Math.abs(error);
        }
        return totalError;
    }
    
    var epoch = function(trainingSet, weights, hiddenLayer, learningRate){
        var totalError = 0;
        for(var i=0; i<trainingSet.inputs.length; i++){
            result = learn(trainingSet.inputs[i], trainingSet.target[i], weights, hiddenLayer, learningRate);
            totalError += result[1];
        }
        return [result[0], (totalError/trainingSet.inputs.length)];
    }

    var epochValidation = function(validationSet, weights, hiddenLayer){
        var totalError = 0;
        for(var i=0; i<validationSet.inputs.length; i++){
            result = learnValidation(validationSet.inputs[i], validationSet.target[i], weights, hiddenLayer);
            totalError += result;
        }
        return (totalError/validationSet.inputs.length);
    }
    
    var train = function(trainingSet, weights, hiddenLayer, learningRate, errorThreshold, maxEpoch){
        var result = [[], errorThreshold + 1], resultValidation = 0;
        var chartDataTraining = [[],[]], chartDataValidation = [], errors = [], gapError, numepoch = 0;

        for(var i=0; i<maxEpoch; i++){
            // console.log("New weights " + JSON.stringify(result[0]));
            if(result[1] > errorThreshold){
                // console.log("Epoch-" + (i+1));
                numepoch++;
                resultValidation = epochValidation(validationset, weights, hiddenLayer);
                chartDataValidation.push(resultValidation);
                result = epoch(trainingSet, weights, hiddenLayer, learningRate);
                // console.log(result[1]);
                chartDataTraining[0].push(i+1);
                chartDataTraining[1].push(result[1]);
                /* if(errors.length<5){
                    errors.push(result[1]);
                }
                else{
                    gapError = 0;
                    for(var j=0; j< errors.length-1;j++){
                        gapError += Math.abs(errors[j]-errors[j+1]);
                    }
                    if(gapError < 0.000001){
                        learningRate = 15;
                    }
                    console.log("Errors= " + JSON.stringify(errors));
                    while(errors.length != 0){
                        errors.pop();
                    }
                } */
            }
            else{
                UIController.getTime(new Date);
                var duration = parseFloat(UIController.calculateDate()).toFixed(2);
                break;
            }
        }
        if(!duration){
            UIController.getTime(new Date);
            var duration = UIController.calculateDate();
            duration = parseFloat(duration * 5).toFixed(2);
        }
        document.querySelector(".resultbar").style.display = "block";
        document.querySelector(".noresult").style.display = "none";
        document.querySelector(".resultwrapper").style.display = "block";
        document.querySelector(".processingstate").style.display = "none";
        document.querySelector(".popupwrapper").style.display = "none";
        document.querySelector(".nocurvewrapper").style.display = "none";
        if(document.querySelector(".chart")){
            document.querySelector(".chart").parentNode.removeChild(document.querySelector(".chart"));
        }
        document.querySelector(".curve").insertAdjacentHTML('beforeend', '<canvas class="chart"></canvas>');
        generateChart(chartDataTraining, chartDataValidation);
        return [result, numepoch, duration];
    }
    
    var generateChart = function(chartDataTraining, chartDataValidation){
        var ctx = document.querySelector('.chart').getContext('2d');
        var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStroke.addColorStop(0, 'rgba(26, 120, 184, 0.6)');
        gradientStroke.addColorStop(1, 'rgba(152, 178, 72, 0.6)');
        var gradientStrokePoint = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStrokePoint.addColorStop(0, 'rgba(26, 120, 184, 1)');
        gradientStrokePoint.addColorStop(1, 'rgba(152, 178, 72, 1)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartDataTraining[0],
                datasets: [{
                    label: 'Training',
                    backgroundColor: gradientStroke,
                    borderColor: gradientStrokePoint,
                    pointBackgroundColor: gradientStrokePoint,
                    pointHoverBackgroundColor: gradientStrokePoint,
                    pointHoverBorderColor: gradientStrokePoint,
                    pointHoverRadius: 8,
                    pointRadius: 0,
                    borderWidth: 4,
                    data: chartDataTraining[1]
                },
                {
                    label: 'Validation',
                    backgroundColor: 'rgba(249, 211, 40, 0.6)',
                    borderColor: 'rgba(249, 211, 40, 1)',
                    pointBackgroundColor: 'rgba(249, 211, 40, 1)',
                    pointHoverBackgroundColor: 'rgba(249, 211, 40, 1)',
                    pointHoverBorderColor: 'rgba(249, 211, 40, 1)',
                    pointHoverRadius: 8,
                    pointRadius: 0,
                    borderWidth: 4,
                    data: chartDataValidation
                }]
            },
            options: {
				tooltips: {
					mode: 'index',
					intersect: false,
				},
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Epoch'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Error"
                        }
                    }]
                }
            }
        });
    }
    return{
        setData: function(threshold, lr, hl){
            errorThreshold = threshold;
            learningRate = lr;
            hiddenLayer = hl;
            listweight = [];
            weights = [];
            listweight.push(trainingset.inputs[0].length);
            if(hiddenLayer[0] > 0){
                for(var i=0; i<hiddenLayer[0];i++){
                    listweight.push(hiddenLayer[1][i]);
                }
            }
            if(trainingset.target[0] == 0){
                listweight.push(1);
            }
            else{
                listweight.push(trainingset.target[0].length);
            }
            for(var i=1; i<listweight.length; i++){
                weights[i-1] = [];
                for(var j=0; j<listweight[i]; j++){
                    weights[i-1][j] = [];
                    for(var k=0; k<listweight[i-1]+1;k++){
                        weights[i-1][j][k] = randomUniform(-2,2);
                        // weights[i-1][j][k] = 0;
                    }
                }
            }
            // console.log("Weights " + JSON.stringify(weights));
        },
        setTrainingset: function(input, output){
            trainingset.inputs = input;
            trainingset.target = output;
            console.log(JSON.stringify(trainingset.target[0]));
        },
        MLP : function(){
            // setInitOldBigDelta(weights);
            console.log(JSON.stringify(weights));
            console.log(JSON.stringify(hiddenLayer));
            var result = train(trainingset, weights, hiddenLayer, learningRate, errorThreshold, maxEpoch);
            return result;
        },
        printout: function(){
            console.log("Error " + JSON.stringify(errorThreshold));
            console.log("LR " + JSON.stringify(learningRate));
            console.log("Hidden " + JSON.stringify(hiddenLayer));
            console.log("Training set " + JSON.stringify(trainingset));
            console.log("Weights " + JSON.stringify(weights));
        },
        getWeights: function(){
            return weights;
        },
        getHiddenLayer: function(){
            return hiddenLayer;
        },
        getThreshold: function(){
            return errorThreshold;
        },
        clearData: function(){
            errorThreshold = 0;
            learningRate = 0;
            hiddenLayer = [];
            weights = [];
        },
        setDataIn: function(dict, meanData, stdDev){
            mean = meanData;
            standardDev = stdDev;
            dictInput = dict;
        },
        setDataOut: function(dict){
            dictOutput = dict;
        },
        getDataIn: function(){
            return [dictInput, mean, standardDev];
        },
        getDataOut: function(){
            return dictOutput;
        },
        setValidationset: function(input, output){
            validationset.inputs = input;
            validationset.target = output;
        },
        getInput: function(){
            return [trainingset.inputs, validationset.inputs];
        }
    }
})();