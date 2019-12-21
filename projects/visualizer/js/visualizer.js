/**
 * Created by PhpStorm.
 * User: lukasz
 * Date: 20.09.16
 * Time: 21:32
 * Project: lukaszmical.pl
 */
canvasSetting = {
    width: 900,
    height: 500
};

sceneConfig = {
    viewer: new Point(0, 0, 300),
    canvas: canvasSetting,
    scale: 100,
    render: RENDER.PERSPECTIVE
    // render: RENDER.FLAT
};

pol1Congig = {
    lineWidth: 4,
    strokeStyle: 'blue',
    lineJoin: 'round'
};
pol2Congig = {
    lineWidth: 4,
    strokeStyle: 'red',
    lineJoin: 'round'
};

axisSetting = {
    lineWidth: 1,
    strokeStyle: 'green',
    lineJoin: 'round'
};


var angle = 5;
var rotateAxis = new Vertex(3, 1, 4);
rotateAxis.normThis();
var rotateMatrix = new Matrix(new Vertex(), new Vertex(), new Vertex());
var pol1 = new Polygon([
    new Vertex(-1, 1, 1),
    new Vertex(-1, -1, 1),
    new Vertex(-1, -1, -1),
    new Vertex(-1, 1, -1),
    new Vertex(-1, 1, 1),
    new Vertex(1, 1, 1),
    new Vertex(1, 1, -1),
    new Vertex(-1, 1, -1)
]);
var pol2 = new Polygon([
    new Vertex(1, -1, -1),
    new Vertex(1, 1, -1),
    new Vertex(1, 1, 1),
    new Vertex(1, -1, 1),
    new Vertex(1, -1, -1),
    new Vertex(-1, -1, -1),
    new Vertex(-1, -1, 1),
    new Vertex(1, -1, 1)
]);

var mouse = new Point(0, 0, 0);
var mouseLazy = new Point(1, 2, 0);
var scene = new Scene(sceneConfig);
var canvas3d, canvas;

function mouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    mouse.set(event.clientX - rect.left, event.clientY - rect.top);
}

function init(id) {
    canvas = document.getElementById(id);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.width = canvasSetting.width;
    canvas.height = canvasSetting.height;
    var ctx = canvas.getContext("2d");
    canvas3d = new Canvas3d(ctx, scene);
    console.log(canvas3d);
    setInterval(function () {
        rotate();
    }, 50);
}


function rotate() {
    canvas3d.cleanCanvas();
    mouseLazy.x += (mouse.x - mouseLazy.x) * 0.3;
    mouseLazy.y += (mouse.y - mouseLazy.y) * 0.3;
    rotateAxis.set(mouseLazy.x - canvasSetting.width / 2, canvasSetting.height / 2 - mouseLazy.y);
    canvas3d.strokeLine([rotateAxis.multiply(0), rotateAxis.multiply(1 / sceneConfig.scale)], axisSetting);

    rotateAxis.normThis();

    rotateMatrix.updateMatrix(rotateAxis, angle);
    pol1.rotate(rotateMatrix);
    canvas3d.strokePolygon(pol1, pol1Congig);
    pol2.rotate(rotateMatrix);
    canvas3d.strokePolygon(pol2, pol2Congig);

}

init('visualizer');