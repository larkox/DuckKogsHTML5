function initGameLoop(environment, game_state, map_file) {
    environment.layers[0].clearRect(0,0,environment.width,environment.height);
    environment.layers[1].clearRect(0,0,environment.width,environment.height);
    environment.layers[2].clearRect(0,0,environment.width,environment.height);
    environment.animate = function() {};
    environment.draw = function() {};
    if (game_state !== {}) {
        //Recupera puntuacion, vidas, etc
    }
    else {
        game_state.lives = 3;
        game_state.time = 0;
    }
    game_state.map = loadMap(map_file);
    waitForMap(environment, game_state);
}

function waitForMap(environment, game_state) {
    if (!game_state.map.ready) {
        setTimeout(function () {
            waitForMap(environment, game_state);
        }, 100);
    }
    else {
        game_state.map = game_state.map.map;
        game_state.player = initPlayer(game_state.map);
        game_state.enemies = initEnemies(game_state.map);
        game_state.kogs = initKogs(game_state.map);
        game_state.objects = [];
        game_state.damages = [];
        game_state.using_image = 0;
        game_state.frame = 0;
        game_state.remaining_kogs = game_state.map.total_kogs;
        environment.animate = animateGameLoop;
        environment.draw = drawGameLoop;
        environment.layers[0].drawImage(game_state.map.background.left, 0, 0);
        environment.layers[0].drawImage(game_state.map.background.central, 80, 0);
        environment.layers[0].drawImage(game_state.map.background.right, 720, 0);
        game_state.map_pos = {};
        game_state.map_pos.x = (environment.layers[0].canvas.width - game_state.map.images[0].width) / 2;
        game_state.map_pos.y = (environment.layers[0].canvas.height - game_state.map.images[0].height) / 2;
        environment.layers[0].drawImage(game_state.map.images[0], game_state.map_pos.x, game_state.map_pos.y);
        document.onkeydown = function(e) {
            onKeyDownGameLoop(e, environment);
        }
        document.onkeyup = function(e) {
            onKeyUpGameLoop(e, environment);
        }
        //setTimeout(function () {
        //    tick(environment, game_state);
        //}, 100);
    }
}

function animateGameLoop(environment, state) {
    state.frame += 1;
    if ((state.frame % 10) == 0)
        state.using_image = (state.using_image + 1) % state.map.textures.length;
    for (var row = 0; row < state.kogs.length; row++) {
        for (var col = 0; col < state.kogs[row].length; col++) {
            if (state.kogs[row][col]) {
                state.kogs[row][col].animate(state);
            }
        }
    }
    var adjust = 0;
    for (var index = 0; index < state.objects.length; index ++) {
        adjust += state.objects[index - adjust].animate(environment, state);
    }
    adjust = 0;
    for (var index = 0; index < state.damages.length; index ++) {
        adjust += state.damages[index - adjust].animate(environment, state);
    }
    for (var index = 0; index < state.enemies.length; index ++) {
        state.enemies[index].animate(environment, state);
    }
    state.player.animate(environment, state);
    if (!state.player.alive) {
        initGameOverLoop(environment, state);
    }
}

function initGameOverLoop(environment, state) {
    environment.animate = function(){};
    environment.draw = function(){};
}

function drawGameLoop(environment, state) {
    environment.layers[1].clearRect(state.map_pos.x, state.map_pos.y, state.map.images[0].width, state.map.images[0].height);
    environment.layers[0].drawImage(state.map.images[state.using_image], state.map_pos.x, state.map_pos.y);
    environment.layers[1].clearRect(10,40,50,50);
    environment.layers[1].fillText(state.remaining_kogs, 10, 50);
    for (var row = 0; row < state.kogs.length; row++) {
        for (var col = 0; col < state.kogs[row].length; col++) {
            if (state.kogs[row][col]) {
                state.kogs[row][col].draw(environment, state);
            }
        }
    }
    for (var index = 0; index < state.objects.length; index++) {
        state.objects[index].draw(environment, state);
    }
    for (var index = 0; index < state.enemies.length; index++) {
        state.enemies[index].draw(environment, state);
    }
    state.player.draw(environment, state);
    for (var index = 0; index < state.damages.length; index++) {
        state.damages[index].draw(environment, state);
    }
}

function onKeyDownGameLoop(e, environment) {
    environment.is_pressed[e.keyCode] = true;
}

function onKeyUpGameLoop(e, environment) {
    environment.is_pressed[e.keyCode] = false;
}
