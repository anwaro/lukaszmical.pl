/**
 * Created by lukasz on 21.09.16.
 */
RENDER = {
    FLAT : 0,
    PERSPECTIVE : 1

};
/**
 * @param {Object} config
 * @param {Object} config.currentTransform - SVGMatrix object for the current transformation matrix.
 * @param {string} config.direction - current text direction used when drawing text.
 * @param {String|CanvasGradient|CanvasPattern} config.fillStyle - color or style to use inside shapes. The default is #000 (black).{color} {gradient} {pattern};
 * @param {String} config.filter - filter effects like blurring or gray-scaling. It is similar to the CSS filter property and accepts the same functions.
 * @param {String} config.font - the current text style being used when drawing text. This string uses the same syntax as the CSS font specifier. The default font is 10px sans-serif.
 * @param {Number} config.globalAlpha - the alpha value that is applied to shapes and images before they are drawn onto the canvas. The value is in the range from 0.0 (fully transparent) to 1.0 (fully opaque).
 * @param {String} config.globalCompositeOperation - type of compositing operation to apply when drawing new shapes, where type is a string identifying which of the compositing or blending mode operations to use.
 * @param {Boolean} config.imageSmoothingEnabled - set to change if images are smoothed (true, default) or not (false).
 * @param {String} config.lineCap - determines how the end points of every line are drawn. There are three possible values for this property and those are: butt, round and square. By default this property is set to butt.
 * @param {Number} config.lineDashOffset - the line dash pattern offset
 * @param {String} config.lineJoin - determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together (degenerate segments with zero lengths, whose specified endpoints and control points are exactly at the same position, are skipped).
 * @param {Number} config.lineWidth - thickness of lines in space units. When getting, it returns the current value (1.0 by default).
 * @param {Number} config.miterLimit - the miter limit ratio in space units. When getting, it returns the current value (10.0 by default)
 * @param {Number} config.shadowBlur - level of the blurring effect; this value doesn't correspond to a number of pixels and is not affected by the current transformation matrix.
 * @param {String} config.shadowColor - the color of the shadow.
 * @param {Number} config.shadowOffsetX - distance that the shadow will be offset in horizontal distance.
 * @param {Number} config.shadowOffsetY - distance that the shadow will be offset in vertical distance.
 * @param {String|CanvasGradient|CanvasPattern} config.strokeStyle - the color or style to use for the lines around shapes
 * @param {String} config.textAlign - current text alignment being used when drawing text
 * @param {String} config.textBaseline - the current text baseline being used when drawing text.
 */
CanvasRenderingContext2D.prototype.loadConfig = function(config){
    for(var prop in config){
        if(config.hasOwnProperty(prop) && prop in this){
            this[prop] = config[prop];
        }
    }
};

/**
 *
 * @param {Point|Vertex|Object} point
 * @param {Number} point.x
 * @param {Number} point.y
 */
CanvasRenderingContext2D.prototype.moveToPoint = function(point){
    this.moveTo(point.x, point.y);
    //console.log(point.x, point.y);
};

/**
 *
 * @param {Point|Vertex|Object} point
 * @param {Number} point.x
 * @param {Number} point.y
 */
CanvasRenderingContext2D.prototype.lineToPoint = function(point){
    this.lineTo(point.x, point.y);
    //console.log(point.x, point.y);
};

var cos = Math.cos;
var sin = Math.sin;

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Scene} scene
 * @constructor
 */
function Canvas3d(ctx, scene) {
    this.ctx = ctx;
    this.scene = scene;
    this.config = scene.config.canvas;

    this.cleanCanvas = function () {
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    };

    this.scale = function(){

    };

    /**
     *
     * @param {Polygon} polygon
     */
    this.fillPolygon = function(polygon){

    };

    /**
     *
     * @param {Polygon} polygon
     * @param {Object} config
     */
    this.strokePolygon = function(polygon, config){
        this.ctx.beginPath();
        this.ctx.loadConfig(config||{});
        var points = polygon.vertexs;

        this.ctx.moveToPoint(this.project(points[0]));
        for(var i =1; i<points.length;i++){
            ctx.lineToPoint(this.project(points[i]));
        }
        this.ctx.lineToPoint(this.project(points[0]));
        this.ctx.stroke();
    };

    /**
     *
     * @param {Vertex[]|Point[]} array
     * @param {Object} config
     */
    this.strokeLine = function(array, config){
        this.ctx.beginPath();
        this.ctx.loadConfig(config||{});
        this.ctx.moveToPoint(this.project(array[0]));
        for(var i =1; i<array.length;i++){
            ctx.lineToPoint(this.project(array[i]));
        }
        this.ctx.stroke();
    };


    this.project = function(vertex){
        if(this.scene.config.render == RENDER.PERSPECTIVE){
            return this.scene.transform(this.scene.project(vertex));
        }else{
            return this.scene.transform(vertex);
        }
    };

}

function Scene(config){
    this.viewer = config.viewer;
    this.config = config;
    this.project = function(vertex){
        return {
            x : vertex.x/(1+vertex.z* this.config.scale/this.viewer.z),
            y : vertex.y/(1+vertex.z* this.config.scale/this.viewer.z),
            z : 0
        };
    };
    this.transform = function(vertex){
        return {
            x : vertex.x * this.config.scale + 0.5 * this.config.canvas.width,
            y : -vertex.y * this.config.scale  + 0.5 * this.config.canvas.height,
            z : vertex.z * this.config.scale
        };
    };

    this.scale = function (vertex) {
        return vertex.multiply(this.config.scale);
    }
}