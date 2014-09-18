function initKogs(map) {
    var kogs = [];
    map.total_kogs = 0;
    for (var row = 0; row < map.height; row++) {
        kogs[row] = [];
        for (var col = 0; col < map.width; col++) {
            if (map.cells[row][col].has_exit) {
                kog = {};
                kog.state = 0;
                kog.frame_count = 0;
                kog.pos = {"x": col, "y": row};
                kog.animate = function() {};
                kog.texture = map.objects_images[constants.KOG_ID];
                kog.draw = function (environment, state) {
                    environment.layers[1].drawImage(this.texture,
                            state.map_pos.x + this.pos.x * constants.SQUAREDIM,
                            state.map_pos.y + this.pos.y * constants.SQUAREDIM);
                }
                kogs[row].push(kog);
                map.total_kogs += 1;
            }
            else kogs[row].push(null);
        }
    }
    return kogs;
}

function initBomb(map, pos) {
    var bomb = {};
    bomb.state = 0;
    bomb.frame_count = 0;
    bomb.pos = {"x": pos.x, "y": pos.y};
    bomb.animate = function(state) {
        this.frame_count += 1;
        if (this.frame_count == 100) {
            explode(state, this.pos);
            state.objects.splice(state.objects.indexOf(this),1);
            return 1;
        }
        return 0;
    };
    bomb.texture = map.objects_images[constants.BOMB_ID];
    bomb.draw = function (environment, state) {
        environment.layers[1].drawImage(this.texture,
                state.map_pos.x + this.pos.x * constants.SQUAREDIM,
                state.map_pos.y + this.pos.y * constants.SQUAREDIM);
    }
    return bomb;
}

function explode(state, pos) {
    var new_pos;
    state.damages.push(initExplosion(state.map, pos));
    if (state.map.cells[pos.y][pos.x].up) {
        new_pos = (pos.y - 1 + state.map.height) % state.map.height;
        state.damages.push(initExplosion(state.map, {"x": pos.x, "y": new_pos}));
    }
    if (state.map.cells[pos.y][pos.x].down) {
        new_pos = (pos.y + 1) % state.map.height;
        state.damages.push(initExplosion(state.map, {"x": pos.x, "y": new_pos}));
    }
    if (state.map.cells[pos.y][pos.x].left) {
        new_pos = (pos.x - 1 + state.map.width) % state.map.width;
        state.damages.push(initExplosion(state.map, {"x": new_pos, "y": pos.y}));
    }
    if (state.map.cells[pos.y][pos.x].right) {
        new_pos = (pos.x + 1) % state.map.width;
        state.damages.push(initExplosion(state.map, {"x": new_pos, "y": pos.y}));
    }
}

function initExplosion(map, pos) {
    var explosion = {};
    explosion.state = 0;
    explosion.frame_count = 0;
    explosion.pos = {"x": pos.x, "y": pos.y};
    explosion.animate = function(state) {
        this.frame_count += 1;
        if (this.frame_count == 100) {
            state.damages.splice(state.damages.indexOf(this),1);
            return 1;
        }
        return 0;
    };
    explosion.texture = map.objects_images[constants.EXPLOSION_ID];
    explosion.draw = function (environment, state) {
        environment.layers[1].drawImage(this.texture,
                state.map_pos.x + this.pos.x * constants.SQUAREDIM,
                state.map_pos.y + this.pos.y * constants.SQUAREDIM);
    }
    return explosion;
}
