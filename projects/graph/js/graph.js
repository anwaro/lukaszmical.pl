/* global HTMLCanvasElement */

_graph =new function(){
    
    
    graph= {};
    /*
     * This is canvas element
     */
    var canvas;
    
    
    /*
     * data
     */
    
    graph.data = {};
    graph.col = {
        /*
         * column color
         */
        color : ["#EF6969", "#93EC30", "#ECB230", "#30ECDB", "#9B30EC", "#B12485", "#2470B1"],
    };
    
    var ctx;
    
    this.init = function(element, data, settings){
        setCanvas(element);
        setSettings(settings);
        prepareData(data);
        set();
        draw();
        
    };
    
    this.getSettings = function(){return  graph.defaultsetings;};
    
    function setCanvas(cv){
        canvas = cv;
        graph.defaultsetings.canvasWidth = canvas.width;        
        graph.defaultsetings.canvasHeight= canvas.height;
        
        ctx = canvas.getContext("2d");
    }
    
    function prepareData(data){
        _max(data);
        _min(data);
        graph.data.data = data;
        if(graph.defaultsetings.sortByLabel){
            graph.data.data = data.sort(sortByLabel);
        }
        if(graph.defaultsetings.sortByValue){
            graph.data.data = data.sort(sortByValue);
        }
        
        graph.data.len = data.length;
        
    }
    
    function sortByLabel(a, b){
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    }
    
    function sortByValue(a,b){
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
    }
    
    function set(){
        canvas.width = graph.defaultsetings.canvasWidth;        
        canvas.height = graph.defaultsetings.canvasHeight;
        
    }
    
    function draw(){
        prepareCol();
        ctx.fillStyle = graph.defaultsetings.bgColor; 
        ctx.fillRect(0, 0, graph.defaultsetings.canvasWidth, graph.defaultsetings.canvasHeight);
        
        
        fillBorder();
        
        var top = graph.defaultsetings.margin + graph.defaultsetings.titleSize;//
        if(graph.defaultsetings.threeD){
            top+=graph.col.margin;
        }
        top+= graph.defaultsetings.title?20:0;
        var left = graph.defaultsetings.margin;
        var t=0;
        for(var i = 0; i < graph.data.data.length; i++){
            left+=graph.col.margin;
            //draw
            t = (graph.col.y - graph.data.data[i][1] * graph.col.ratio) + top;

            drawColumn(left, t, graph.col.width, graph.data.data[i][1] * graph.col.ratio, graph.col.margin, i, graph.defaultsetings.threeD);

            setText(graph.data.data[i][1], left, t, graph.col.width, graph.data.data[i][1]<graph.data.max/2, 1);
            setText(graph.data.data[i][0], left, top + graph.col.y , graph.col.width, 0, 0);

            left+=graph.col.width;
            left+=graph.col.margin;
        }
        if(graph.defaultsetings.title !== ""){
            ctx.textAlign="center";
            ctx.textBaseline="top"; 
            ctx.fillStyle=graph.defaultsetings.titleColor; 
            ctx.font= graph.defaultsetings.titleSize+'px Courier New';
            
            ctx.fillText(graph.defaultsetings.title, graph.defaultsetings.canvasWidth/2, graph.defaultsetings.margin);
            
        }
        
    }
    
    function drawColumn(x, y, w, h, m, i, _3d){
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = getColor(i, 0);            
        ctx.strokeStyle = getColor(i, 0);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+h);
        ctx.lineTo(x+w, y+h);
        ctx.lineTo(x+w, y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        
        if(_3d){
            ctx.fillStyle = getColor(i, -0.2);          
            ctx.strokeStyle = getColor(i, 0);
            ctx.beginPath(); 
            ctx.moveTo(x, y);
            ctx.lineTo(x+m, y-m);
            ctx.lineTo(x+w+m, y-m);
            ctx.lineTo(x+w, y);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.fill();
            
            ctx.beginPath(); 
            ctx.moveTo(x+w, y);
            ctx.lineTo(x+w+m, y-m);
            ctx.lineTo(x+w+m, y+h-m);
            ctx.lineTo(x+w, y+h);
            ctx.lineTo(x+w, y);
            ctx.stroke();
            ctx.fill();
            
            
        }
    }
    
    function colorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
    }
    
    function fillBorder(){
        if(graph.defaultsetings.borderWidth){
            ctx.strokeStyle = graph.defaultsetings.borderColor;
            ctx.lineWidth = 2*graph.defaultsetings.borderWidth;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, graph.defaultsetings.canvasHeight);
            ctx.lineTo(graph.defaultsetings.canvasWidth, graph.defaultsetings.canvasHeight);
            ctx.lineTo(graph.defaultsetings.canvasWidth, 0);
            ctx.lineTo(0, 0);
            ctx.stroke();
        }
    }
    
    function setText(text, x, y, w, top, col){
        ctx.textAlign="center";
        ctx.font=graph.defaultsetings.valSize+'px Courier New';
        if(col){
            if(top){ 
                ctx.textBaseline="bottom";
                ctx.fillText(text, x+w/2, y-graph.col.margin);
            }
            else{

                ctx.fillStyle="white";
                ctx.textBaseline="top"; 
                ctx.fillText(text, x+w/2, y+5);
            }
        }
        else{
            ctx.font=graph.defaultsetings.labelSize+'px Courier New';
            ctx.textBaseline="top";
            ctx.fillStyle=graph.defaultsetings.labelColor; 
            ctx.fillText(text, x+w/2, y);
            
        }
        
    }
    
    
    function getColor(i, lum){
        return colorLuminance(graph.col.color[i%graph.col.color.length], lum);

    }
    
    function prepareCol(){
        var x = graph.defaultsetings.canvasWidth - 2* graph.defaultsetings.margin;
        x/=graph.data.len;
        graph.col.margin = 0.1 * x;
        graph.col.width = 0.8 * x;
        
        graph.col.x = x;
        
        var y = graph.defaultsetings.canvasHeight - 2*graph.defaultsetings.margin ;
        y -= graph.defaultsetings.title?(20+graph.defaultsetings.titleSize):0;
        y -=  graph.defaultsetings.labelSize;
        
        if(graph.defaultsetings.threeD){
            y-=graph.col.margin;
            graph.col.width -= graph.col.margin/graph.data.len;
        }
        
        graph.col.y = y;
        graph.col.ratio = y/graph.data.max;
        
        
    }
    
   
    function _max(data){
        var max = data[0][1];
        for(var i=0; i<data.length; i++){
            if(data[i][1]>max){
                max = data[i][1];
            }
        }        
        graph.data.max = max;
    }
    
    function _min(data){
        var min = data[0][1];
        for(var i=0; i<data.length; i++){
            if(data[i][1]<min){
                min = data[i][1];
            }
        }
        graph.data.min = min;
    }
    
    function setSettings(settings){
        if(typeof settings === "object"){
            for(var setting in settings){
                graph.defaultsetings[setting] = settings[setting];
            }
        }
    }
    
    function log(k){
        console.log(k);
    }
    
    graph.defaultsetings={
        /*
         * Graph's title
         */
        title : " ",
        
        /*
         * Graph's title
         */
        titleSize : 25,
        /*
         * Graph's title
         */
        titleColor : "",
        
        /*
         * background color
         */
        bgColor : "#C5C5C5",
        
        
        /*
         * margin
         */
        margin : 5,
        
        /*
         * 
         */
        labelSize : 20,
        
        /*
         * 
         */
        labelColor : "black",
        
        
        /*
         * 
         */
        valSize : 20,
                
        /*
         * Border width
         */
        borderWidth : 1,
        
        /*
         * border color
         */
        borderColor : "#282828",
        
        /*
         * Sort by x argument
         */
        sortByValue : false,
        
        /*
         * Sort by y argument
         */
        sortByLabel : false,
        
        /*
         *  3D column
         */
        
        threeD : false,
        
        /*
         * canvas width
         */
        canvasWidth: 300,
        
        /*
         * canvas height 
         */
        canvasHeight : 300
    };
};

HTMLCanvasElement.prototype.graph = function (data, setting) {_graph.init(this, data, setting); };
