function initMenuLoop(environment, state) {
    state.selected = 0;
    environment.animate = animateMenuLoop;
    environment.draw = drawMenuLoop;
    //TODO Write background
    environment.layers[0].fillStyle = "#00AA00";
    environment.layers[0].fillRect(0,0,800,600);
    environment.layers[0].fillStyle = "#000000";
    environment.layers[0].textBaseline = "top";
    environment.layers[0].font = "25px Gothic";
    for (var index = 0; index < constants.MENU.length; index++) {
        environment.layers[0].fillText(texts[constants.MENU[index]], 100, 100 + 35 * index);
    }
    environment.layers[1].textBaseline = "top";
    environment.layers[1].font = "bold 25px Gothic";
    environment.layers[1].fillStyle = "#AA0000";
    document.onkeydown = function(e) {
        onKeyDownGameLoop(e, environment);
        if (e.keyCode == constants.KEY_UP) {
            state.previous = state.selected;
            state.selected = (state.selected - 1 + constants.MENU.length) % constants.MENU.length;
        }
        else if (e.keyCode == constants.KEY_DOWN) {
            state.previous = state.selected;
            state.selected = (state.selected + 1) % constants.MENU.length;
        }
        else if (e.keyCode == constants.KEY_ENTER) {
            switch (constants.MENU[state.selected]) {
                case "new_game":
                    initGameLoop(environment, state, "maps/map01.json");
                    break;
            }
        }
    }
    document.onkeyup = function(e) {
        onKeyUpGameLoop(e, environment);
    }
    setTimeout(function () {
        tick(environment, state);
    }, 100);
}

function animateMenuLoop(environment, state) {
}

function drawMenuLoop(environment, state) {
    environment.layers[1].clearRect(100, 100 + 35 * (state.previous), 200, 25);
    environment.layers[1].fillText(texts[constants.MENU[state.selected]], 100, 100 + 35 * state.selected);
}

function onKeyDownGameLoop(e, environment) {
    environment.is_pressed[e.keyCode] = true;
}

function onKeyUpGameLoop(e, environment) {
    environment.is_pressed[e.keyCode] = false;
}
