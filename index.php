<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Pong 3D - Darcey@aftc.io</title>
    <link href="includes/css/styles.css?v=<?php echo(rand(0, 9999999)); ?>" rel="stylesheet" type="text/css"/>
    <script src="includes/js/aftc.min.js"></script>
    <script src="includes/js/TweenMax.min.js"></script>


    <script src="./includes/js/Detector.js"></script>
    <script src="./includes/js/stats.min.js"></script>
    <script src="./includes/js/three.min.js"></script>

    <script src="./includes/js/OrbitControls.js"></script>

    <!-- WARNING: SEQUENCE IS IMPORTANT: EffectComposer > Shaders > Pass -->
    <script src="./includes/js/EffectComposer.js"></script>
    <script src="./includes/js/CopyShader.js"></script>

    <script src="./includes/js/RenderPass.js"></script>
    <script src="./includes/js/MaskPass.js"></script>
    <script src="./includes/js/ShaderPass.js"></script>

    <script src="./includes/js/FilmShader.js"></script>
    <script src="./includes/js/FilmPass.js"></script>

    <script src="includes/js/app.js?v=<?php echo(rand(0, 9999999)); ?>"></script>
    <script src="includes/js/global.js?v=<?php echo(rand(0, 9999999)); ?>"></script>

    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-2426360-16"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());    
        gtag('config', 'UA-2426360-16');
    </script>

</head>

<body>


<div id="start">
    <input type="button" onclick="start()" value="CLICK TO START">
</div>

<div id="game">
    <canvas id="floor-texture" width="512" height="256"></canvas>
    <div id="score-left"></div>
    <div id="score-right"></div>
    <div id="how">Position mouse left and right over game area to control paddles / bats</div>
    <div id="btn-container">
        <button id="btn-go-fs" class="btn-fs" onclick="goFullScreen()">Go Fullscreen</button>
        <button id="btn-exit-fs" class="btn-fs" onclick="exitFullScreen()">Exit Fullscreen</button>
    </div>
</div>


<div id="debug-container">
    <div id="out"></div>
</div>
<div id="debug">
    <div id="debug1" class="debug-box"></div>
    <div id="debug2" class="debug-box"></div>
    <div id="debug3" class="debug-box"></div>
    <div id="debug4" class="debug-box"></div>
    <div id="debug5" class="debug-box"></div>
</div>


</body>

</html>