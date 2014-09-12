function initEnvironment() {
    var environment = {};
    environment.layers = [];
    environment.layers[0] = document.getElementById("backLayer").getContext("2d");
    environment.layers[1] = document.getElementById("mainLayer").getContext("2d");
    environment.layers[2] = document.getElementById("frontLayer").getContext("2d");

    environment.is_pressed = {};

    initGameLoop(environment, {}, "maps/map01.json");
}

function tick(environment, game_state) {
    environment.animate(environment, game_state);
    environment.draw(environment, game_state);
    setTimeout(function () {
        tick(environment, game_state);
    }, constants.FRAME_TIME);
}
