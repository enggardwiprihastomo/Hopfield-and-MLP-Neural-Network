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
                content = '<div class="wrappertrainingpattern"><div class="displaypattern" id="training' + x.length + '">';
                elements.forEach(function(e){
                    content += '<div class="smallelement" id="training' + i + 'pat' + x.length + '"></div>';
                    i++;
                });
                content += '</div><div class="patternnumber">PATTERN ' + x.length + '</div></div>';
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

                if(dimension[1] * 30 > 500){
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