var TestController = (function(){
    var inputs, outputs;
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
    
    var learn = function(inputs, weights, hiddenLayer){
        var calcResult = [];
        var finalResult = [];
        
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
                finalResult.push(forwardPass(calcResult[hiddenLayer[0]-1], weights[weights.length-1][j]));
            }
        }
        else{
            calcResult.push([]);
            for(var i=0; i<weights[weights.length-1].length; i++){
                finalResult.push(forwardPass(inputs, weights[weights.length-1][i]));
            }
        }
        return finalResult;
    }

    return {
        setInput: function(data){
            inputs = data;
        },
        setOutput: function(data){
            outputs = data;
        },
        getInput: function(){
            return inputs;
        },
        /* startTest: function(weights, hiddenLayer, errorThreshold){
            var data = [[],[],[]];
            for(var i=0; i<inputs.length; i++){
                var result = learn(inputs[i], weights, hiddenLayer);
                data[0].push(outputs[i]);
                data[1].push(result);
                var totalError = 0;
                if(outputs[i].length > 0){
                    for(var j=0; j<result.length;j++){
                        totalError += Math.abs(outputs[i][j] - result[j]);
                    }
                    totalError = totalError/outputs[i].length;
                }
                else{
                    totalError =  Math.abs(outputs[i] - result[0]);
                }
                if(totalError <= (errorThreshold * 2)){
                    data[2].push("T");
                }
                else{
                    data[2].push("F");
                }
            }
            return data;
        } */
        startTest: function(weights, hiddenLayer, errorThreshold){
            var data = [[],[],[]];
            for(var i=0; i<inputs.length; i++){
                var result = learn(inputs[i], weights, hiddenLayer);
                data[0].push(outputs[i]);
                data[1].push(result);

                var max = result[0];
                var idx = 0;

                for(var j=0; j<result.length;j++){
                    if(max <= result[j]){
                        max = result[j];
                        idx = j;
                    }
                }
                if(outputs[i].length > 0){
                    if(outputs[i][idx] == 1){
                        data[2].push("T");
                    }
                    else{
                        data[2].push("F");
                    }
                }
                else{
                    if(Math.abs(outputs[i] - result) <= errorThreshold*2){
                        data[2].push("T");
                    }
                    else{
                        data[2].push("F");
                    }
                }
            }
            return data;
        }
    }
})();