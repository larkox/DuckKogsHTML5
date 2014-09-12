function initPlayer(map) {
    var player = {};
    player.direction = 0;
    player.state = 0;
    player.frame_count = 0;
    player.pos = map.init_pos;
    player.texture = map.player;
    player.moving = false;
    player.movement_state = 0;
    player.draw = function (environment, state) {
        if (!movingThroughBorders(player, state.map)) {
            var draw_pos = calculateDrawPosition(player, state.map.dim);
            environment.layers[1].drawImage(player.texture,
                    player.state * constants.SQUAREDIM,
                    player.direction * constants.SQUAREDIM,
                    constants.SQUAREDIM, constants.SQUAREDIM,
                    state.map_pos.x + draw_pos.x * constants.SQUAREDIM,
                    state.map_pos.y + draw_pos.y * constants.SQUAREDIM,
                    constants.SQUAREDIM, constants.SQUAREDIM);
        }
        else {
            drawThroughBorder(player, environment, state);
        }
    }
    player.animate = function (environment, state) {
        player.frame_count += 1;
        if (player.moving) {
            if ((player.frame_count % 2) == 0) {
                player.movement_state += 1 / 8;
                if (player.movement_state >= 1) {
                    player.moving = false;
                    player.movement_state = 0;
                }
            }
            if ((player.frame_count % 5) == 0) {
                player.state = (player.state + 1) % 2;
            }
        }
        else {
            if ((player.frame_count % 10) == 0) {
                player.state = (player.state + 1) % 2;
            }
            var current_pos;
            if (environment.is_pressed[constants.KEY_UP]) {
                current_pos = state.player.pos;
                if (state.map.cells[current_pos.y][current_pos.x].up) {
                    state.player.pos.y = (state.player.pos.y - 1 + state.map.height) % state.map.height;
                    state.player.moving = true;
                }
                state.player.direction = constants.UP;
            }
            else if (environment.is_pressed[constants.KEY_DOWN]) {
                current_pos = state.player.pos;
                if (state.map.cells[current_pos.y][current_pos.x].down) {
                    state.player.pos.y = (state.player.pos.y + 1 + state.map.height) % state.map.height;
                    state.player.moving = constants.DOWN;
                }
                state.player.direction = 2;
            }
            else if (environment.is_pressed[constants.KEY_LEFT]) {
                current_pos = state.player.pos;
                if (state.map.cells[current_pos.y][current_pos.x].left) {
                    state.player.pos.x = (state.player.pos.x - 1 + state.map.width) % state.map.width;
                    state.player.moving = true;
                }
                state.player.direction = constants.LEFT;
            }
            else if (environment.is_pressed[constants.KEY_RIGHT]) {
                current_pos = state.player.pos;
                if (state.map.cells[current_pos.y][current_pos.x].right) {
                    state.player.pos.x = (state.player.pos.x + 1 + state.map.width) % state.map.width;
                    state.player.moving = true;
                }
                state.player.direction = constants.RIGHT;
            }
        }
    }
    return player;
}

function calculateDrawPosition(sprite) {
    draw_position = {};
    if (!sprite.moving) return sprite.pos;
    if (sprite.direction === constants.UP) {
        draw_position.x = sprite.pos.x;
        draw_position.y = sprite.pos.y + (1 - sprite.movement_state);
    }
    else if (sprite.direction === constants.DOWN) {
        draw_position.x = sprite.pos.x;
        draw_position.y = sprite.pos.y - (1 - sprite.movement_state);
    }
    else if (sprite.direction === constants.LEFT) {
        draw_position.x = sprite.pos.x + (1 - sprite.movement_state);
        draw_position.y = sprite.pos.y;
    }
    else if (sprite.direction === constants.RIGHT) {
        draw_position.x = sprite.pos.x - (1 - sprite.movement_state);
        draw_position.y = sprite.pos.y;
    }
    return draw_position;
}

function movingThroughBorders(sprite, map) {
    return sprite.moving && (
            sprite.direction === constants.UP && sprite.pos.y === map.height - 1 ||
            sprite.direction === constants.DOWN && sprite.pos.y === 0 ||
            sprite.direction === constants.LEFT && sprite.pos.x === map.width - 1 ||
            sprite.direction === constants.RIGHT && sprite.pos.x === 0);
}

function drawThroughBorder(sprite, environment, state) {
    var draw_position = {};
    if (sprite.direction === constants.UP) {
        draw_position.x = sprite.pos.x;
        draw_position.y = sprite.pos.y + (1 - sprite.movement_state);
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM,
                constants.SQUAREDIM, Math.max(1, sprite.movement_state * constants.SQUAREDIM),
                state.map_pos.x + draw_position.x * constants.SQUAREDIM,
                state.map_pos.y + draw_position.y * constants.SQUAREDIM,
                constants.SQUAREDIM, sprite.movement_state * constants.SQUAREDIM);
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM + sprite.movement_state * constants.SQUAREDIM,
                constants.SQUAREDIM, (1 - sprite.movement_state) * constants.SQUAREDIM,
                state.map_pos.x + draw_position.x * constants.SQUAREDIM,
                state.map_pos.y,
                constants.SQUAREDIM, (1 - sprite.movement_state) * constants.SQUAREDIM);
    }
    else if (sprite.direction === constants.DOWN) {
        draw_position.x = sprite.pos.x;
        draw_position.y = sprite.pos.y - (1 - sprite.movement_state);
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM + (1 - sprite.movement_state) * constants.SQUAREDIM,
                constants.SQUAREDIM, Math.max(1, sprite.movement_state * constants.SQUAREDIM),
                state.map_pos.x + draw_position.x * constants.SQUAREDIM,
                state.map_pos.y,
                constants.SQUAREDIM, sprite.movement_state * constants.SQUAREDIM);
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM,
                constants.SQUAREDIM, (1 - sprite.movement_state) * constants.SQUAREDIM,
                state.map_pos.x + draw_position.x * constants.SQUAREDIM,
                state.map_pos.y + state.map.height * constants.SQUAREDIM - (1 - sprite.movement_state) * constants.SQUAREDIM,
                constants.SQUAREDIM, (1 - sprite.movement_state) * constants.SQUAREDIM);
    }
    else if (sprite.direction === constants.LEFT) {
        draw_position.x = sprite.pos.x + (1 - sprite.movement_state);
        draw_position.y = sprite.pos.y;
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM,
                Math.max(1, sprite.movement_state * constants.SQUAREDIM), constants.SQUAREDIM,
                state.map_pos.x + draw_position.x * constants.SQUAREDIM,
                state.map_pos.y + draw_position.y * constants.SQUAREDIM,
                sprite.movement_state * constants.SQUAREDIM, constants.SQUAREDIM);
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM + sprite.movement_state * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM,
                (1 - sprite.movement_state) * constants.SQUAREDIM, constants.SQUAREDIM,
                state.map_pos.x,
                state.map_pos.y + draw_position.y * constants.SQUAREDIM,
                (1 - sprite.movement_state) * constants.SQUAREDIM, constants.SQUAREDIM);
    }
    else if (sprite.direction === constants.RIGHT) {
        draw_position.x = sprite.pos.x - (1 - sprite.movement_state);
        draw_position.y = sprite.pos.y;
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM + (1 - sprite.movement_state) * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM,
                Math.max(1, sprite.movement_state * constants.SQUAREDIM), constants.SQUAREDIM,
                state.map_pos.x,
                state.map_pos.y + draw_position.y * constants.SQUAREDIM,
                sprite.movement_state * constants.SQUAREDIM, constants.SQUAREDIM);
        environment.layers[1].drawImage(sprite.texture,
                sprite.state * constants.SQUAREDIM,
                sprite.direction * constants.SQUAREDIM,
                (1 - sprite.movement_state) * constants.SQUAREDIM, constants.SQUAREDIM,
                state.map_pos.x + state.map.width * constants.SQUAREDIM - (1 - sprite.movement_state) * constants.SQUAREDIM,
                state.map_pos.y + draw_position.y * constants.SQUAREDIM,
                (1 - sprite.movement_state) * constants.SQUAREDIM, constants.SQUAREDIM);
    }
    return draw_position;
}

function initEnemies(map) {
    var enemy_list = [],
        enemy,
        index;
    for (index = 0; index < map.enemies.length; index++) {
        enemy = {};
        enemy.direction = 0;
        enemy.state = 0;
        enemy.frame_count = 0;
        enemy.pos = map.enemies[index].pos;
        enemy.animate = assignAction(map.enemies[index].id);
        enemy.texture = map.enemies_images[map.used_enemies.indexOf(map.enemies[index].id)];
        enemy.draw = function (environment, state) {
            environment.layers[1].drawImage(enemy.texture,
                    state.map_pos.x + enemy.pos.x * constants.SQUAREDIM,
                    state.map_pos.y + enemy.pos.y * constants.SQUAREDIM);
        }
        enemy_list[index] = enemy;
    }
    return enemy_list;
}

function assignAction(id) {
    switch(id) {
        case 1:
            return bomberAction;
            break;
        case 2:
            return angryAction;
            break;
        case 3:
            return fastAction;
            break;
    }
}

function bomberAction(state) {
}

function angryAction(state) {
}

function fastAction(state) {
}
