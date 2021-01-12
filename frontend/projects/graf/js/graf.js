var weight = 500;
var height = 500;


function Graf(n, d) {
    n = n || 10;
    maxDist = d || 50;
    node = [];
    ctx = null;
    canvas = null;


    this.generateNode = function () {
        for (var i = 0; i < n; i++) {
            node.push(this.newNode());
        }
    };

    this.newNode = function () {
        return new GraphNode(this.rand(0, weight), this.rand(0, height),
            this.rand(0.01, 0.1), this.rand(0.01, 0.1));
    };

    this.rand = function (start, stop) {
        return Math.random() * (stop - start) + start;
    };

    this.findNeigh = function () {

    };

    this.main = function () {

    };

    this.loop = function () {
        setInterval(this.main, 50);
    };

    this.draw = function (node1, node2) {
        if (node1.distance(node2) < this.maxDist) {

        }
    };

    this.drawNodes = function () {
        for (var i = 0; i < n; i++) {
            for (var j = i; j < n; j++) {
                this.draw(this.node[i], this.node[j]);
            }
        }

    };
};


function GraphNode(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.neigh = [];

    this.disstance = function (node) {
        return Math.sqrt(Math.pow(node.x - this.x, 2) + Math.pow(node.y - this.y, 2));
    };

    this.updatePos = function () {
        if (this.x + this.vx > weight || this.x + this.vx < 0) this.vx *= -1;
        if (this.y + this.vy > height || this.y + this.vy < 0) this.vy *= -1;
        this.x += this.vx;
        this.y += this.vy;
    };
}