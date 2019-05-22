// Author: darcey@aftc.io
// Libs: aftc.js & three
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var Pong3D = function () {
    var args = {};
    var vars = {
        debug: false,
        dom: {
            container: false,
            canvas1: false,
        },
        ctx1: false,
        textures: {
            floor: false,
            room: false,
        },
        materials: {
            floor: false,
            room: false,
        },
        meshes: {
            floor: false,
            room: false,
        },
        clock: false,
        effectComposer: false,
        canvas1HalfW: 0, canvas1HalfH: 0,
        cX: 0, cY: 0, // Center
        sX: 0, sY: 0, // Start
        pX: 0, pY: 0, // Previous
        tX: 0, tY: 0, // Target
        w: 0, h: 0, // window.innerWidth / innerHeight
        x: 0, y: 0, // general x,y
        t: 0, // time when needed
        leftScore: 0,
        rightScore: 0,
        running: false,
        batPosYPercent: false,
        batPosZ: false,
        BALLDIAMETER: 1,
        HEIGHT: 1,
        newBallX: 0,
        newBallY: 0,
        batLeftLowerZ: false,
        batLeftUpperZ: false,
        batRightLowerZ: false,
        batRightUpperZ: false,
        leftCollisionPoint: false,
        rightCollisionPoint: false,
        keepRendering: true,
        renderMode: 0, // 0 color, 1 black and white film pass
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    // constructor
    function init() {
        if (isMobile()) {
            // setupGame();
        } else {
            var opener = new Audio("./assets/sounds/shall_we_play_a_game.mp3");
            // opener.addEventListener("ended",setupGame);
            opener.play();
        }


        if (vars.debug === false){
            getElementById("debug-container").style.display = "none";
            getElementById("debug").style.display = "none";
        }


        vars.dom.container = getElementById("container");
        //vars.dom.container.getBoundingClientRect().width;
        // vars.w = Math.round(parseFloat(getComputedStyle(vars.dom.container).width));
        // vars.h = Math.round(parseFloat(getComputedStyle(vars.dom.container).height));
        vars.w = window.innerWidth;
        vars.h = window.innerHeight;
        vars.cX = vars.w / 2;
        vars.cY = vars.h / 2;

        vars.dom.canvas1 = getElementById("floor-texture");
        vars.ctx1 = vars.dom.canvas1.getContext("2d");
        vars.canvas1HalfW = vars.dom.canvas1.width / 2;
        vars.canvas1HalfH = vars.dom.canvas1.height / 2;


        loadAssets();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function loadAssets() {
        // log("Application.loadAssets()");
        //
        var url = "./assets/img/pong_walls.png";
        var loader = new THREE.TextureLoader();
        loader.load(
            url,
            // onLoad callback
            function (texture) {
                vars.textures.room = texture;
                vars.textures.room.wrapS = THREE.RepeatWrapping;
                vars.textures.room.repeat.x = - 1;
                setupScene();
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            function (e) {
                console.error('An error happened.');
                log(e);
            }
        );
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    function updateFloorTexture() {
        log("Pong3D.updateFloorTexture()");
        html("score-right", vars.rightScore);
        html("score-left", vars.leftScore);

        vars.ctx1.fillStyle = "#232323";
        vars.ctx1.fillRect(0, 0, vars.dom.canvas1.width, vars.dom.canvas1.height);

        vars.ctx1.beginPath();
        vars.ctx1.setLineDash([15, 15]);
        vars.ctx1.moveTo(vars.canvas1HalfW, 0);
        vars.ctx1.lineTo(vars.canvas1HalfW, vars.dom.canvas1.height);
        vars.ctx1.strokeStyle = "RGBA(255,255,255,0.5)";
        vars.ctx1.lineWidth = 10;
        vars.ctx1.stroke();

        vars.ctx1.font = '100pt VT323';
        vars.ctx1.fillStyle = "RGBA(255,255,255,0.9)";
        // Classic pong score positions
        // vars.ctx1.fillText(vars.leftScore, (vars.canvas1HalfW-76), 50);
        // vars.ctx1.fillText(vars.rightScore, (vars.canvas1HalfW+30), 50);
        vars.ctx1.fillText(vars.leftScore, 60, 120);
        vars.ctx1.fillText(vars.rightScore, 320, 120);

        if (vars.meshes.floor) {
            vars.textures.floor = new THREE.Texture(vars.dom.canvas1);
            vars.textures.floor.needsUpdate = true;
            vars.materials.floor.map = vars.textures.floor;
        }

        if (vars.shader) {
            if (vars.shader.renderToScreen) {
                vars.shader.renderToScreen = false;
            } else {
                vars.shader.renderToScreen = true;
            }
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    function setTouchCoords(e) {
        e.preventDefault();
        var x = e.changedTouches[0].pageX;
        var y = e.changedTouches[0].pageY;
        vars.mX = x;
        vars.mY = y;
        // html("score-right", "x="+x);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function setMouseCoords(e) {
        // vars.mX = e.clientX-vars.dom.container.offsetLeft;
        // vars.mY = e.clientY-vars.dom.container.offsetTop;
        vars.mX = e.clientX;
        vars.mY = e.clientY;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function setupScene() {
        // Remove body bg as it was put there so codepen gives a nicer preview
        document.body.style.background = "none";
        document.body.style.backgroundColor = "#000000";

        log("isMobile() = " + isMobile());
        if (isMobile()) {
            getElementById("debug-container").style.display = "none";
            var msg = getElementById("how");
            msg.innerHTML = "Drag finger from left to right to position paddles / bats";
            var btn1 = getElementById("btn-go-fs");
            var btn2 = getElementById("btn-exit-fs");
            btn1.classList.add("btn-fs-mobile");
            btn2.classList.add("btn-fs-mobile");
            how.classList.add("how-mobile");
        }

        if (!Detector.webgl) Detector.addGetWebGLMessage();
        vars.scene = new THREE.Scene();
        vars.renderer = new THREE.WebGLRenderer({antialias: true});
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(vars.w, vars.h);
        vars.renderer.setClearColor("#0C7CA5", 0);
        document.body.appendChild(vars.renderer.domElement);
        // camera
        vars.camera = new THREE.PerspectiveCamera(60, vars.w / vars.h, 1, 5000);
        vars.camera.position.set(2, 8, 10);
        vars.scene.add(vars.camera);

        // Clock
        vars.clock = new THREE.Clock();

        // controls
        vars.controls = new THREE.OrbitControls(vars.camera, vars.renderer.domElement);
        // vars.controls.minDistance = 5;
        // vars.controls.maxDistance = 10;
        vars.controls.maxPolarAngle = Math.PI / 2;

        // stats
        // vars.stats = new Stats()
        // document.body.appendChild(vars.stats.dom);

        // lights
        vars.scene.add(new THREE.AmbientLight(0x222222));
        // vars.light = new THREE.PointLight( 0xffffff, 1 );
        // vars.camera.add( vars.light );
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(75, 75, 50);
        light.castShadow = true;
        var dLight = 200;
        var sLight = dLight * 0.25;
        light.shadow.camera.left = -sLight;
        light.shadow.camera.right = sLight;
        light.shadow.camera.top = sLight;
        light.shadow.camera.bottom = -sLight;
        light.shadow.camera.near = dLight / 30;
        light.shadow.camera.far = dLight;
        light.shadow.mapSize.x = 1024 * 2;
        light.shadow.mapSize.y = 1024 * 2;
        vars.scene.add(light);

        // helper
        // vars.scene.add( new THREE.AxesHelper( 5 ) );

        // scene
        // vars.group = new THREE.Group();
        // vars.scene.add(vars.group);

        updateFloorTexture();
        vars.textures.floor = new THREE.Texture(vars.dom.canvas1);
        vars.textures.floor.needsUpdate = true;
        vars.materials.floor = new THREE.MeshLambertMaterial({
            // color: 0x333333,
            map: vars.textures.floor
        });

        var matWall = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });

        var matBat = new THREE.MeshLambertMaterial({
            color: 0x00FF00,
        });

        var ballMat = new THREE.MeshLambertMaterial({
            color: 0xFFFF00,
        });

        vars.gameW = 70;
        vars.gameH = 30;

        // Floor
        var floorGeom = new THREE.PlaneGeometry(vars.gameW, vars.gameH);
        vars.meshes.floor = new THREE.Mesh(floorGeom, vars.materials.floor);
        vars.meshes.floor.rotation.x = degToRad(-90);
        vars.scene.add(vars.meshes.floor);

        // Walls
        var topWallGeom = new THREE.BoxGeometry(vars.gameW - 0.5, 1, 1);
        var topWall = new THREE.Mesh(topWallGeom, matWall);
        topWall.position.x = 0;
        topWall.position.y = 0.5;
        topWall.position.z = -(vars.gameH / 2);
        vars.scene.add(topWall);

        var btmWall = new THREE.Mesh(topWallGeom, matWall);
        btmWall.position.x = 0;
        btmWall.position.y = 0.5;
        btmWall.position.z = (vars.gameH / 2);
        vars.scene.add(btmWall);

        // bats
        var batGeom = new THREE.BoxGeometry(0.5, 1, 5);
        vars.batLeft = new THREE.Mesh(batGeom, matBat);
        vars.batLeft.position.x = -(vars.gameW / 2);
        vars.batLeft.position.y = 0.5;
        vars.batLeft.position.z = 0;
        vars.scene.add(vars.batLeft);

        vars.batRight = new THREE.Mesh(batGeom, matBat);
        vars.batRight.position.x = (vars.gameW / 2);
        vars.batRight.position.y = 0.5;
        vars.batRight.position.z = 0;
        vars.scene.add(vars.batRight);

        var ballGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        vars.ball = new THREE.Mesh(ballGeom, ballMat);
        vars.ball.position.y = 0.5;
        vars.scene.add(vars.ball);

        vars.ballX = vars.sX;
        vars.ballY = vars.sY;
        vars.ballVx = -0.2;
        vars.ballVy = 0.1;

        vars.upperLim = (vars.gameH / 2) - 0.5;
        vars.lowerLim = -vars.upperLim;

        vars.mX = 0;
        vars.mY = 0;
        document.body.addEventListener("mousemove", setMouseCoords);
        vars.renderer.domElement.addEventListener("touchstart", setTouchCoords, false);
        vars.renderer.domElement.addEventListener("touchmove", setTouchCoords, false);

        window.addEventListener('resize', resizeHandler, false);




        // postprocessing
        vars.effectComposer = new THREE.EffectComposer(vars.renderer);
        vars.effectComposer.addPass(new THREE.RenderPass(vars.scene, vars.camera));

        vars.filmPass = new THREE.FilmPass(
            0.7,   // noise intensity
            0.5,  // scanline intensity
            2048,    // scanline count
            true,  // grayscale
        );
        vars.filmPass.renderToScreen = true;
        vars.effectComposer.addPass(vars.filmPass);

        // vars.shader = new THREE.FilmPass(0.35, 0.5, 2048, true);
        // vars.shader.renderToScreen = true;
        // vars.effectComposer.addPass(vars.shader);


        // room
        vars.materials.room = new THREE.MeshLambertMaterial({
            color: 0x003399,
            // receiveShadow:true,
            // castShadow:true
            // opacity: 1,
            // transparent: false
            side: THREE.BackSide,
            map: vars.textures.room
        });


        var roomGeom = new THREE.BoxGeometry(200, 40, 200);
        vars.meshes.room = new THREE.Mesh(roomGeom, vars.materials.room);
        vars.meshes.room.position.x = 0;
        vars.meshes.room.position.y = 10;
        vars.meshes.room.position.z = 0;
        // vars.meshes.room.scale.x = -1; // Can flip texture this way but better done on the texture than flipping the mesh
        vars.scene.add(vars.meshes.room);



        // Animate and Render
        animate();
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





    function getDirection() {

    }

    function getBatLeftY() {
        return vars.batLeft.z;
    }

    function getBatRightY() {
        return vars.batRight.z;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function toggleRenderMode(){
        if (vars.renderMode == 0){
            vars.renderMode = 1;
        } else {
            vars.renderMode = 0;
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function animate() {
        // Position the bats
        vars.batPosYPercent = Math.floor((100 / vars.w) * (Math.abs(vars.mX)));
        vars.batPosZ = -15 + (30 / 100) * vars.batPosYPercent;
        vars.batLeft.position.z = vars.batPosZ;
        vars.batRight.position.z = -vars.batPosZ;

        vars.newBallX = vars.ballX + vars.ballVx * 1;
        vars.newBallY = vars.ballY + vars.ballVy * 1;

        // Top and bottom edges, simply bounce
        if (vars.newBallY < vars.lowerLim) {
            vars.ballVy = -vars.ballVy;
            vars.newBallY = vars.ballY + vars.ballVy * 1;
            playSound("wall");
        } else if (vars.newBallY > vars.upperLim) {
            vars.ballVy = -vars.ballVy;
            vars.newBallY = vars.ballY + vars.ballVy * 1;
            playSound("wall");
        }

        // Left paddle (paddle1)
        vars.batLeftLowerZ = vars.batLeft.position.z - 3;
        vars.batLeftUpperZ = vars.batLeft.position.z + 3
        vars.batRightLowerZ = vars.batRight.position.z - 3;
        vars.batRightUpperZ = vars.batRight.position.z + 3
        vars.leftCollisionPoint = -(vars.gameW / 2) + 0.5;
        vars.rightCollisionPoint = -vars.leftCollisionPoint;

        var reset = false;
        if (vars.newBallX < vars.leftCollisionPoint) {
            if (vars.newBallY >= vars.batLeftLowerZ && vars.newBallY <= vars.batLeftUpperZ) {
                vars.ballVx = -vars.ballVx;
                vars.newBallX = vars.ballX + vars.ballVx * 1;
                playSound("bat");
            } else {
                playSound("fail");
                vars.rightScore++;
                updateFloorTexture();
                toggleRenderMode();

                vars.newBallX = vars.sX;
                vars.newBallY = vars.sY;
                restart();
                reset = true;
            }
        } else if (vars.newBallX > vars.rightCollisionPoint) {
            if (vars.newBallY >= vars.batRightLowerZ && vars.newBallY <= vars.batRightUpperZ) {
                vars.ballVx = -vars.ballVx;
                vars.newBallX = vars.ballX + vars.ballVx * 1;
                playSound("bat");
            } else {
                playSound("fail");
                vars.leftScore++;
                updateFloorTexture();
                toggleRenderMode();
                restart();
                reset = true;
            }
        }

        if (!reset) {
            vars.ballX = vars.newBallX;
            vars.ballY = vars.newBallY;
            vars.ball.position.x = vars.newBallX;
            vars.ball.position.z = vars.newBallY;

            // speed up!
            vars.ballVx *= 1.001;
            if (vars.ballVy > 0) {
                vars.ballVy *= 1.0001;
            }

            // Make the camera more interesting
            // left target -36 9 12
            // right target 36 9 12
            vars.camXLim = 42;
            vars.camXasPercent = (100 / (vars.gameW / 2)) * vars.newBallX; // -100 to 100
            // html("out",vars.camXasPercent);
            vars.camRange = 10;
            vars.camX = (vars.camRange / 10) * vars.camXasPercent;
            // html("out",camX);
            if (vars.camX > vars.camXLim) {
                vars.camX = vars.camXLim;
            } else if (vars.camX < -vars.camXLim) {
                vars.camX = -vars.camXLim;
            }
            vars.camera.position.x = vars.camX;
            vars.camera.position.y = 8;
            vars.camera.position.z = 16;
            vars.camera.lookAt(vars.ball.position);
        }


        vars.ball.rotation.z -= (vars.ballVx / 3);
        vars.ball.rotation.x -= (vars.ballVx / 3);
        // if (vars.ballVx > 0){
        //   vars.ball.rotation.z += vars.ballVx;
        // } else {
        //   vars.ball.rotation.z += vars.ballVx;
        // }


        if (vars.keepRendering) {
            render();
            requestAnimationFrame(animate);
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    function playSound(name) {
        var url;
        var error = false;
        switch (name) {
            case "wall":
                url = "./assets/sounds/pong.mp3"
                break;
            case "bat":
                url = "./assets/sounds/pong2.mp3"
                break;
            case "fail":
                url = "./assets/sounds/fail_01.mp3"
                break;
            default:
                error = true;
                break;
        }
        if (!error) {
            var s = new Audio(url);
            s.play();
        }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    var t = 0;

    function render(now) {
        // NOTE: Delta time for some reason is stuck at 0 to 0.0017, going to use my own time var
        html("debug1","deltatime = " + vars.clock.getDelta());
        html("debug2","t = " + t);





        if (vars.renderMode == 0){
            vars.effectComposer.render(t);
        } else {
            vars.renderer.render(vars.scene, vars.camera);
        }

    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    function resizeHandler() {
        vars.w = window.innerWidth;
        vars.h = window.innerHeight;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function start() {
        log("Application.start()");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function stop() {
        log("Application.stop()");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function restart() {
        vars.ballX = vars.sX;
        vars.ballY = vars.sY;
        var velXmin = -getRandomFloat(0.1, 0.2);
        var velXmax = getRandomFloat(0.1, 0.2);
        var velYmin = -getRandomFloat(0.1, 0.15);
        var velYmax = getRandomFloat(0.1, 0.15);
        var velX = [velXmin, velXmax];
        var velY = [velYmin, velYmax];
        vars.ballVx = velX[getRandomInt(0, 1)];
        vars.ballVy = velY[getRandomInt(0, 1)];
        // html("v4", "vx:" + vars.ballVx.toFixed(3) + " vy:" + vars.ballVy.toFixed(3));

    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Utils
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Public
    this.start = function () {
    };
    this.stop = function () {
    };
    this.reset = function () {
        restart();
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Constructor simulation
    init();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
