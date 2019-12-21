colorpicker = function(elementId, callback){
    var element = document.getElementById(elementId)
    
    var barval = 34;
    var areaval = [150, 50];
    var currentColor;
    
    
    var css = ".colorPicker{position:absolute;z-index:9999;bottom:-225px;height:225px;width:275px;background:#282828;display:none}.colorPickerArea{float: left;height:200px;width:200px;margin:12.5px}.colorPickerBar{float:left;height:155px;width:40px;margin-top:10px;}.colorPickerColor{height:40px; width:40px;margin-top:10px;float:left;}"
   
    var head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    
    var colorPicker = createElement("div", {className : 'colorPicker'});
    var canvasArea = createElement("canvas", {className : 'colorPickerArea', height:200, width :200});
    var canvasBar = createElement("canvas", {className : 'colorPickerBar', height:155, width :40});
    var canvasColor = createElement("canvas", {className : 'colorPickerColor', height:40, width :40});    
    
    var ctxArea = canvasArea.getContext("2d");
    var ctxBar = canvasBar.getContext("2d");
    var ctxColor = canvasColor.getContext("2d");
    
    colorPicker.appendChild(canvasArea);
    colorPicker.appendChild(canvasBar);
    colorPicker.appendChild(canvasColor);    
    element.appendChild(colorPicker);   
    
    
    
    var colors = colorINBar();
    var areaMouseDown = false;
    var barMouseDown = false;    
    
    
    function showColorPicker(event){
        colorPicker.style.display = "block";
    }
    
    function areaClick(event){
        var rect = canvasArea.getBoundingClientRect();
        areaval[0] = parseInt(event.clientX - rect.left);
        areaval[1] = parseInt(event.clientY - rect.top);
        render();
    }
    
    function barClick(event){
        var rect = canvasBar.getBoundingClientRect();
        barval = parseInt(event.clientY - rect.top);
        render();
        
    }
    
    function render(){
        renderBar();
        renderArea();
        addPicker();
        fillBoxColor();
        
        if(typeof callback === 'function'){
            callback(element, currentColor);
        }
        
    }
    
    function createElement(type, option){
        var element = document.createElement(type);
        for( var i in option){
            element[i] = option[i];
        }
        return element;
    }
    
    function colorINBar(){
        var data = [];
        var step = 10;
        for(var i = 0; i<260; i+=step){
            data.push([255, 0, i]);
        }
        for(var i = 250; i>0; i-=step){
            data.push([i, 0, 255]);
        }
        for(var i = 0; i<260; i+=step){
            data.push([0, i, 255]);
        }        
        for(var i = 255; i>0; i-=step){
            data.push([0, 255, i]);
        }
        for(var i = 0; i<260; i+=step){
            data.push([i, 255, 0]);
        }
        for(var i = 255; i>0; i-=step){
            data.push([255, i, 0]);
        }
        return data;
    }
    
    function renderBar(){
        ctxBar.clearRect(0, 0, 40, 155);
        for(var i=0; i<colors.length;i++){
            ctxBar.beginPath();
            ctxBar.strokeStyle = "rgb("+colors[i][0]+', '+colors[i][1]+', '+colors[i][2]+")";
            ctxBar.lineWidth = 1;
            
            ctxBar.moveTo(0, i);
            ctxBar.lineTo(40, i);
            ctxBar.stroke();
        }
    }
    
    function renderArea(){
        var color = colors[barval];
        
        var rDx = (255 - color[0])/200,
            gDx = (255 - color[1])/200,
            bDx = (255 - color[2])/200,
            r, g, b;
    
        ctxArea.clearRect(0, 0, 200, 200);
        
        for(var i =0; i<200; i++){
            for(var j =0; j<200; j++){
                ctxArea.beginPath();
                r = 255 - i*rDx;
                r = r - r*j/200;
                g = 255 - i*gDx;
                g = g - g*j/200;
                b = 255 - i*bDx;
                b = b - b*j/200;
                ctxArea.fillStyle = "rgb("+parseInt(r)+', '+parseInt(g)+', '+parseInt(b)+")";                
                ctxArea.fillRect( i, j, 1, 1 );
                
            }
        }
    }
    
    function addPicker(){
        ctxArea.beginPath();
        ctxArea.strokeStyle = "rgb(100, 100, 100)";  
        ctxArea.arc(areaval[0], areaval[1], 5, 0, 2*Math.PI);
        ctxArea.stroke();
        ctxArea.beginPath();
        ctxArea.strokeStyle = "rgb(255, 255, 255)";  
        ctxArea.arc(areaval[0], areaval[1], 6, 0, 2*Math.PI);
        ctxArea.stroke();
        
        
        ctxBar.beginPath();
        ctxBar.strokeStyle = "rgb(0, 0, 0)";
        ctxBar.lineWidth = 2;

        ctxBar.moveTo(0, barval-2);
        ctxBar.lineTo(2, barval);
        ctxBar.lineTo(38, barval);
        ctxBar.lineTo(40, barval+2);
        ctxBar.lineTo(40, barval-2);
        ctxBar.lineTo(38, barval);
        ctxBar.lineTo(2, barval);
        ctxBar.lineTo(0, barval+2);
        ctxBar.lineTo(0, barval-2);
        ctxBar.stroke();
    }
    
    function fillBoxColor(){
        var color= ctxArea.getImageData(areaval[0], areaval[1], 1, 1).data;
        currentColor = "rgb("+color[0]+"," +color[1]+","+color[2]+")"; 
        ctxColor.beginPath();
        ctxColor.fillStyle = currentColor;
        ctxColor.fillRect( 0, 0, 40, 40);
    }

    function bodyClick(event){
        var el = event.target;

        if(el.isSameNode(element)
            || el.isSameNode(colorPicker)
            || el.parentNode.isSameNode(colorPicker))
        {
            return true;
        }else{
            colorPicker.style.display = "none";
        }
    }
    
    element.addEventListener("click", showColorPicker);
    canvasArea.addEventListener("click", areaClick);
    canvasBar.addEventListener("click", barClick);
    colorPicker.addEventListener("focusout", function(){alert('ll');colorPicker.style.display='none';});
    
    canvasArea.addEventListener("mousedown", function(){areaMouseDown=true;});
    canvasBar.addEventListener("mousedown", function(){barMouseDown=true;});
    
    canvasArea.addEventListener("mouseup", function(){areaMouseDown=false;});
    canvasBar.addEventListener("mouseup", function(){barMouseDown=false;});
    
    canvasArea.addEventListener("mousemove", function(event){areaMouseDown&&areaClick(event);});
    canvasBar.addEventListener("mousemove", function(event){barMouseDown&&barClick(event);});
    
    canvasArea.addEventListener("mouseleave", function(){areaMouseDown=false;});
    canvasBar.addEventListener("mouseleave", function(){barMouseDown=false;});

    document.addEventListener('click', bodyClick);
    
    render();
};