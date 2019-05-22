// Author: darcey@aftc.io
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function start(){
    log("<span style='color:#FFCC00'>Position mouse left and right over game area to control paddles / bats</a>");


    getElementById("start").style.display = "none";
    getElementById("game").style.display = "block";

    // getElementById("btn-go-fs").style.display = "inline-block";
    // getElementById("btn-exit-fs").style.display = "none";

    pong = new Pong3D();
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



var pong;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
onReady(function () {


    getElementById("game").style.display = "none";


    logTo("out");
    log("Darcey@AFTC.io");

});
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -