function loadMap(file) {
    var xmlhttp,
        result = {"ready":false},
        ready = false;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",file,true);
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 3)
            loadMapTextures()
    }
    xmlhttp.send();
    return result;
    function loadMapTextures() {
        var ready_textures, game_map;
        game_map = JSON.parse(xmlhttp.responseText);
        ready_textures = 0;
        game_map.textures_images = [];
        for (var texture = 0; texture < game_map.textures.length; texture++) {
            ready_textures[texture] = false;
            game_map.textures_images[texture] = new Image();
            game_map.textures_images[texture].onload = function () {
                ready_textures += 1;
            }
            game_map.textures_images[texture].src = game_map.textures[texture];
        }
        function checkTextures() {
            if (ready_textures < game_map.textures.length) {
                setTimeout(checkTextures, 100);
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
        checkTextures();
    }
}
