function loadMap(file) {
    var xmlhttp,
        result = {"ready":false},
        ready = false;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",file,true);
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 3)
            loadMapResources(result, xmlhttp.responseText);
    }
    xmlhttp.send();
    return result;
}

function loadMapResources(result, responseText) {
    var ready_resources, game_map;
    game_map = JSON.parse(responseText);
    ready_resources = {"n":0};
    game_map.textures_images = [];
    game_map.enemies_images = {};
    game_map.objects_images = {};
    for (var resource = 0; resource < game_map.textures.length; resource++) {
        game_map.textures_images[resource] = new Image();
        game_map.textures_images[resource].onload = function () {
            ready_resources.n += 1;
        }
        game_map.textures_images[resource].src = game_map.textures[resource];
    }
    for (var resource = 0; resource < game_map.used_enemies.length; resource++) {
        game_map.enemies_images[game_map.used_enemies[resource]] = new Image();
        game_map.enemies_images[game_map.used_enemies[resource]].onload = function () {
            ready_resources.n += 1;
        }
        game_map.enemies_images[game_map.used_enemies[resource]].src = "images/enemy" + game_map.used_enemies[resource] + ".png";
    }
    game_map.player = new Image();
    game_map.player.onload = function () {
        ready_resources.n += 1;
    }
    game_map.player.src = "images/player" + game_map.used_player + ".png";
    game_map.background = {};

    game_map.background.left = new Image();
    game_map.background.left.onload = function() {
        ready_resources.n += 1;
    }
    game_map.background.left.src = "images/leftPanel.png";

    game_map.background.central = new Image();
    game_map.background.central.onload = function() {
        ready_resources.n += 1;
    }
    game_map.background.central.src = "images/centralPanel.png";

    game_map.background.right = new Image();
    game_map.background.right.onload = function() {
        ready_resources.n += 1;
    }
    game_map.background.right.src = "images/rightPanel.png";

    game_map.objects_images[constants.KOG_ID] = new Image();
    game_map.objects_images[constants.KOG_ID].onload = function() {
        ready_resources.n += 1;
    }
    game_map.objects_images[constants.KOG_ID].src = "images/kog.png";

    game_map.objects_images[constants.BOMB_ID] = new Image();
    game_map.objects_images[constants.BOMB_ID].onload = function() {
        ready_resources.n += 1;
    }
    game_map.objects_images[constants.BOMB_ID].src = "images/bomb.png";

    game_map.objects_images[constants.EXPLOSION_ID] = new Image();
    game_map.objects_images[constants.EXPLOSION_ID].onload = function() {
        ready_resources.n += 1;
    }
    game_map.objects_images[constants.EXPLOSION_ID].src = "images/explosion.png";

    game_map.needed_resources =
        game_map.textures.length +
        game_map.used_enemies.length + 1 + 3 + 3;
    checkTextures(result, game_map, ready_resources);
}

function checkTextures(result, game_map, ready_resources) {
    if (ready_resources.n < game_map.needed_resources) {
        setTimeout(function() {
            checkTextures(result, game_map, ready_resources);
        }, 100);
    }
    else {
        var contexts = [];
        game_map.images = [];
        for (var texture = 0; texture < game_map.textures.length; texture++) {
            game_map.images[texture] = document.createElement("canvas");
            game_map.images[texture].width = constants.SQUAREDIM * game_map.width;
            game_map.images[texture].height = constants.SQUAREDIM * game_map.height;
            game_map.images[texture].hidden = true;
            game_map.images[texture].id = "texture" + texture;
            contexts[texture] = game_map.images[texture].getContext("2d");
        }
        var texture_pos_x, texture_pos_y;
        for (var row = 0; row < game_map.height; row++) {
            for (var col = 0; col < game_map.width; col++) {
                cell = game_map.cells[row][col];
                texture_pos_x = (cell.up + cell.down * 2) * constants.SQUAREDIM;
                texture_pos_y = (cell.left + cell.right * 2) * constants.SQUAREDIM;
                cell.pos = {"x": col, "y": row};
                cell.occupied = false;
                cell.occupied_by = null;
                cell.has_exit = texture_pos_x + texture_pos_y != 0;
                for (var texture = 0; texture < game_map.textures.length; texture++) {
                    contexts[texture].drawImage(game_map.textures_images[texture],
                            texture_pos_x, texture_pos_y, constants.SQUAREDIM, constants.SQUAREDIM,
                            col * constants.SQUAREDIM, row * constants.SQUAREDIM, constants.SQUAREDIM, constants.SQUAREDIM);
                }
            }
        }
        result.map = game_map;
        result.ready = true;
    }
};
