var UIController = (function(){
    var DOM = {
        Menu: document.querySelectorAll(".menuwrapper"),
        Popup: document.querySelector(".popupwrapper"),
        Training: document.querySelector(".trainingwrapper"),
        Test: document.querySelector(".testwrapper"),
        Load: document.querySelector(".btn-load"),
        LoadTest: document.querySelector(".btn-loadtest"),
        LoadVal: document.querySelector(".btn-val"),
        Trainingset: document.querySelector(".trainingset"),
        Testset: document.querySelector(".testset"),
        Valset: document.querySelector(".valset"),
        NetDiagram: document.querySelector(".lowerdata"),
        Add: document.querySelector(".btn-add"),
        MessageSection: document.querySelector(".messagesection"),
        Input: document.querySelector(".inputcontent"),
        Delete: document.querySelectorAll(".btn-delete"),
        Body: document.querySelector("body"),
        HiddenInput: document.querySelectorAll(".hiddenneuronfield"),
        InputInfo: document.querySelector(".inputinfo"),
        HiddenInfo: document.querySelector(".hiddeninfo"),
        OutputInfo: document.querySelector(".outputinfo"),
        DataInfo: document.querySelector(".datainfo"),
        Reset: document.querySelector(".btn-reset"),
        Threshold: document.querySelector(".errorThreshold"),
        LR: document.querySelector(".learningrate"),
        Process: document.querySelector(".btn-process"),
        ProcessTest: document.querySelector(".btn-processtest"),
        Loading: document.querySelector(".processingstate"),
        Curve: document.querySelector(".nocurvewrapper"),
        Chart: document.querySelector(".chart"),
        Result: document.querySelector(".resultwrapper"),
        NoResult: document.querySelector(".noresult"),
        ResultBar: document.querySelector(".resultbar")
    }, ProcessTime = [];
    
    var deleteMessage = function(){
        setTimeout(function(){
            if(document.querySelector(".message")){
                document.querySelector(".message").parentElement.removeChild(document.querySelector(".message"));
            }
        }, 5000)
    }
    return {
        DOM: DOM,
        Message: function(message){
            DOM.MessageSection.insertAdjacentHTML('beforeend', "<div class='message'>" + message + "</div>");
            deleteMessage();
        },
        DeleteObj: function(obj){
            obj.parentNode.removeChild(obj);
        },
        DeleteMultipleObj: function(obj){
            obj.forEach(function(el){
                if(el.id){
                    el.parentNode.removeChild(el);
                }
            });
        },
        FreeObj: function(obj){
            obj.forEach(function(el){
                el.parentNode.removeChild(el);
            });
        },
        insertObj: function(parent, obj, state = 'afterbegin'){
            parent.insertAdjacentHTML(state, obj);
        },
        insertHidden: function(obj){
            obj.forEach(function(el){
                if(document.getElementById("hiddenlayer-" + el.id)){
                    document.querySelectorAll("#hiddenlayer-" + el.id).forEach(function(hidden){
                        hidden.parentNode.removeChild(hidden);
                    });
                }
                if(el.value && el.value!=0){
                    var neuron;
                    neuron = '<div class="hiddenwrapper" id="hiddenlayer-' + el.id + '">';
                    for(var i=0; i<el.value; i++){
                        neuron += '<div class="hiddenneuron"></div>';
                    }
                    neuron += '</div>';
                    document.querySelector(".hiddensection").insertAdjacentHTML('beforeend', neuron);
                }
            });
        },
        deleteHidden: function(id){
            if(document.getElementById("hiddenlayer-" + id)){
                document.querySelectorAll("#hiddenlayer-" + id).forEach(function(el){
                    el.parentNode.removeChild(el);
                });
            }
        },
        insertIn: function(parent, count){
            if(document.querySelector(".inputneuron")){
                document.querySelectorAll(".inputneuron").forEach(function(el){
                    el.parentNode.removeChild(el);
                });
            }
            if(count && count != 0){
                var neuron = '';
                for(var i=0; i<count; i++){
                    neuron += '<div class="inputneuron"></div>';
                }
                parent.insertAdjacentHTML('afterbegin', neuron);
            }
        },
        insertOut: function(parent, count){
            if(document.querySelector(".outputneuron")){
                document.querySelectorAll(".outputneuron").forEach(function(el){
                    el.parentNode.removeChild(el);
                });
            }
            if(count && count != 0){
                if(count>2){
                    var neuron = '';
                    for(var i=0; i<count; i++){
                        neuron += '<div class="outputneuron"></div>';
                    }
                    parent.insertAdjacentHTML('afterbegin', neuron);
                }
                else{
                    parent.insertAdjacentHTML('afterbegin', '<div class="outputneuron"></div>');
                }
            }
        },
        Display: function(obj, state){
            obj.style.display = state;
        },
        AddHidden: function(){
            this.DOM.Delete = document.querySelectorAll(".btn-delete");
        },
        AddHiddenInput: function(){
            this.DOM.HiddenInput = document.querySelectorAll(".hiddenneuronfield");
        },
        setInfo: function(inputs, outputs, data){
            if(inputs == 0){
                DOM.InputInfo.innerHTML = "";
            }
            else{
                DOM.InputInfo.innerHTML = "<div class='iconinput'></div> Input - " + inputs;
            }
            if(outputs == 0){
                DOM.OutputInfo.innerHTML = "";
            }
            else{
                if(outputs == 2){
                    outputs = 1;
                }
                DOM.OutputInfo.innerHTML = "<div class='iconoutput'></div> Output - " + outputs;
            }
            if(data == 0){
                DOM.DataInfo.innerHTML = "";
            }
            else{
                DOM.DataInfo.innerHTML = "<div class='icondata'></div> Data - " + data;
            }
        },
        setInfoHidden: function(data){
            var count = 0, neurons ='(', i=0;
            data.forEach(function(el){
                i++;
                if(el.value && el.value != 0){
                    count++;
                    if(i < data.length){
                        neurons += parseFloat(el.value) + ', '
                    }
                    else{
                        neurons += parseFloat(el.value) + ')'
                    }
                }
            });
            if(count == 0){
                DOM.HiddenInfo.innerHTML = "";
            }
            else{
                DOM.HiddenInfo.innerHTML = "<div class='iconhidden'></div> Hidden - " + count + neurons;
            }
        },
        GetHiddenLayer: function(data){
            var count = 0, neurons = [];
            data.forEach(function(el){
                if(el.value && el.value != 0){
                    neurons.push(parseFloat(el.value));
                    count++;
                }
            });
            return [count, neurons];
        },
        DisplayResult: function(data){
            document.getElementById("epoch").innerHTML = data[1];
            document.getElementById("error").innerHTML = data[0][1];
            document.getElementById("wb").innerHTML = JSON.stringify(data[0][0]);
            document.getElementById("time").innerHTML = data[2] + "s";
        },
        getTime: function(date){
            ProcessTime.push(date);
        },
        clearTime: function(){
            while(ProcessTime.length !=0){
                ProcessTime.pop();
            }
        },
        calculateDate: function(){
            var diff = (ProcessTime[1].getTime() - ProcessTime[0].getTime()) / 1000;
            return Math.abs(diff);
        },
    };
})();