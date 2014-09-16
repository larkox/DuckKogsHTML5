function initPlayer(map) {
    var player = {};
    player.direction = 0;
    player.state = 0;
    player.frame_count = 0;
    player.pos = map.init_pos;
    player.texture = map.player;
    player.moving = false;
    player.movement_state = 0;
    player.draw = drawSprite;
    player.animate = function (environment, state) {
        this.frame_count += 1;
        if (this.moving) {
            if ((this.frame_count % 2) == 0) {
                this.movement_state += 1 / 8;
                if (this.movement_state >= 1) {
                    this.moving = false;
                    this.movement_state = 0;
                    if (state.kogs[this.pos.y][this.pos.x]) {
                        state.kogs[this.pos.y][this.pos.x] = null;
                        state.remaining_kogs -= 1;
                    }
                }
            }
            if ((this.frame_count % 5) == 0) {
                this.state = (this.state + 1) % 2;
            }
        }
        else {
            if ((this.frame_count % 10) == 0) {
                this.state = (this.state + 1) % 2;
            }
            var current_pos;
            if (environment.is_pressed[constants.KEY_UP]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].up) {
                    this.pos.y = (this.pos.y - 1 + state.map.height) % state.map.height;
                    this.moving = true;
                }
                this.direction = constants.UP;
            }
            else if (environment.is_pressed[constants.KEY_DOWN]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].down) {
                    this.pos.y = (this.pos.y + 1 + state.map.height) % state.map.height;
                    this.moving = constants.DOWN;
                }
                this.direction = 2;
            }
            else if (environment.is_pressed[constants.KEY_LEFT]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].left) {
                    this.pos.x = (this.pos.x - 1 + state.map.width) % state.map.width;
                    this.moving = true;
                }
                this.direction = constants.LEFT;
            }
            else if (environment.is_pressed[constants.KEY_RIGHT]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].right) {
                    this.pos.x = (this.pos.x + 1 + state.map.width) % state.map.width;
                    this.moving = true;
                }
                this.direction = constants.RIGHT;
            }
        }
    }
    return player;
}

function drawSprite(environment, state) {
    if (!movingThroughBorders(this, state.map)) {
        var draw_pos = calculateDrawPosition(this, state.map.dim);
        environment.layers[1].drawImage(this.texture,
                this.state * constants.SQUAREDIM,
                this.direction * constants.SQUAREDIM,
                constants.SQUAREDIM, constants.SQUAREDIM,
                state.map_pos.x + draw_pos.x * constants.SQUAREDIM,
                state.map_pos.y + draw_pos.y * constants.SQUAREDIM,
                constants.SQUAREDIM, constants.SQUAREDIM);
    }
    else {
        drawThroughBorder(this, environment, state);
    }
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
        enemy.movement_state = 0;
        enemy.moving = false;
        enemy.pos = map.enemies[index].pos;
        enemy.animate = assignAction(map.enemies[index].id);
        enemy.texture = map.enemies_images[map.used_enemies.indexOf(map.enemies[index].id)];
        enemy.draw = drawSprite;
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
    this.frame_count += 1;
    if (this.moving) {
        if (this.running) {
            this.movement_state += 1 / 8;
        }
        else if ((this.frame_count % 2) == 0) {
            this.movement_state += 1 / 8;
        }
        if (this.movement_state >= 1) {
            this.moving = false;
            this.running = false;
            this.movement_state = 0;
        }
        //if ((this.frame_count % 5) == 0) {
        //    this.state = (this.state + 1) % 2;
        //}
    }
    else {
        //if ((this.frame_count % 10) == 0) {
        //    this.state = (this.state + 1) % 2;
        //}
        if (this.pos.x == state.player.pos.x) {
            var up = checkLine(this.pos.y, state.player.pos.y, this.pos.x, state.map, constants.UP);
            var down = checkLine(this.pos.y, state.player.pos.y, this.pos.x, state.map, constants.DOWN);
            if ((up && down && up < down) || (up && !down)) {
                this.pos.y = (this.pos.y - 1 + state.map.height) % state.map.height;
                this.moving = true;
                this.running = true;
                this.direction = constants.UP;
            }
            else if (down) {
                this.pos.y = (this.pos.y + 1) % state.map.height;
                this.moving = true;
                this.running = true;
                this.direction = constants.DOWN;
            }
        }
        else if (this.pos.y == state.player.pos.y) {
            var left = checkLine(this.pos.x, state.player.pos.x, state.player.pos.y, state.map, constants.LEFT);
            var right = checkLine(this.pos.x, state.player.pos.x, state.player.pos.y, state.map, constants.RIGHT);
            if ((left && right && left < right) || (left && !right)) {
                this.pos.x = (this.pos.x - 1 + state.map.width) % state.map.width;
                this.moving = true;
                this.running = true;
                this.direction = constants.LEFT;
            }
            else if (right) {
                this.pos.x = (this.pos.x + 1) % state.map.width;
                this.moving = true;
                this.running = true;
                this.direction = constants.RIGHT;
            }
        }
        if (!this.moving && (this.frame_count % 10 == 0) && Math.random() > 0.8) {
            moveRandom(this, state.map);
        }
    }
}

function moveRandom(sprite, map) {
    var direction = Math.floor(Math.random() * 4);
    var new_pos;
    switch (direction) {
        case constants.UP:
            new_pos = (sprite.pos.y - 1 + map.height) % map.height;
            if (map.cells[sprite.pos.y][sprite.pos.x].up && !map.cells[new_pos][sprite.pos.x].occupied) {
                sprite.pos.y = new_pos;
                sprite.moving = true;
                sprite.direction = constants.UP;
            }
            break;
        case constants.DOWN:
            new_pos = (sprite.pos.y + 1) % map.height;
            if (map.cells[sprite.pos.y][sprite.pos.x].down && !map.cells[new_pos][sprite.pos.x].occupied) {
                sprite.pos.y = new_pos;
                sprite.moving = true;
                sprite.direction = constants.DOWN;
            }
            break;
        case constants.LEFT:
            new_pos = (sprite.pos.x - 1 + map.width) % map.width;
            if (map.cells[sprite.pos.y][sprite.pos.x].left && !map.cells[sprite.pos.y][new_pos].occupied) {
                sprite.pos.x = new_pos;
                sprite.moving = true;
                sprite.direction = constants.LEFT;
            }
            break;
        case constants.RIGHT:
            new_pos = (sprite.pos.x + 1) % map.width;
            if (map.cells[sprite.pos.y][sprite.pos.x].right && !map.cells[sprite.pos.y][new_pos].occupied) {
                sprite.pos.x = new_pos;
                sprite.moving = true;
                sprite.direction = constants.RIGHT;
            }
            break;
    }
}

function checkLine(pos_ini, pos_end, line, map, direction) {
    var acum = 0;
    var current_pos = pos_ini;
    switch (direction) {
        case constants.UP:
            while(map.cells[current_pos][line].up) {
                current_pos = (current_pos - 1 + map.height) % map.height;
                acum += 1;
                if (pos_end == current_pos) {
                    return acum;
                }
            }
            break;
        case constants.DOWN:
            while(map.cells[current_pos][line].down) {
                current_pos = (current_pos + 1) % map.height;
                acum += 1;
                if (pos_end == current_pos) {
                    return acum;
                }
            }
            break;
        case constants.LEFT:
            while(map.cells[line][current_pos].left) {
                current_pos = (current_pos - 1 + map.width) % map.width;
                acum += 1;
                if (pos_end == current_pos) {
                    return acum;
                }
            }
            break;
        case constants.RIGHT:
            while(map.cells[line][current_pos].right) {
                current_pos = (current_pos + 1) % map.width;
                acum += 1;
                if (pos_end == current_pos) {
                    return acum;
                }
            }
            break;
    }
}
