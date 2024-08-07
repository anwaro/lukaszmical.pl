let container;

let camera, scene, renderer;

let mouseX = 0,
    mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(
        12,
        window.innerWidth / window.innerHeight,
        1,
        2000,
    );
    camera.position.z = 30;

    // scene

    scene = new THREE.Scene();

    const ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // texture

    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    const texture = new THREE.Texture();

    const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    const onError = function (xhr) {};

    var loader = new THREE.ImageLoader(manager);
    loader.load('/projects/car3d/image/UV_Grid_Sm.jpg', function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    });

    // model

    var loader = new THREE.OBJLoader(manager);
    loader.load(
        '/projects/car3d/image/gtr_1.obj',
        function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });

            object.position.y = 0;
            object.position.x = 20;
            scene.add(object);
        },
        onProgress,
        onError,
    );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight - 100);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
}

//

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x = 0;
    camera.position.y = 0;

    scene.rotation.y += 0.002;

    //scene.children[2].position.set( 0, 20, scene.children[2].position.z );
    //mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -center.x, -center.y, -center.z ) );

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

init();
animate();
