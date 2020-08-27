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
            UIController.Message("Please enter proper dimension values");
        }
        else{
            if(UIController.statusPattern){
                UIController.Message("Please firstly press reset button to create new pattern dimension");
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
        UIController.removeElement("wrappertrainingpattern");
        UIController.removeElement("wrappertestpattern");
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
                        UIController.Message("Dimension of the file that you insert doesn\'t match with existed pattern's dimension, please insert proper or similar dimension or firstly press reset button to create new pattern dimension")
                    }
                }
                else{
                    if(UIController.statusPattern){
                        UIController.Message("Please firstly press reset button to create new pattern dimension");
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