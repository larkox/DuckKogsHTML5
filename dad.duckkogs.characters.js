function initPlayer(map) {
    var player = {};
    player.alive = true;
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
                        playSound(environment, constants.SOUND_KOG_GET);
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
            if (hasDamage(state, this.pos)) {
                this.alive = false;
                return;
            }
            if (state.map.cells[this.pos.y][this.pos.x].occupied) {
                this.alive = false;
                return;
            }
            var current_pos;
            if (environment.is_pressed[constants.KEY_UP]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].up) {
                    this.pos.y = (this.pos.y - 1 + state.map.height) % state.map.height;
                    this.moving = true;
                    playSound(environment, constants.SOUND_PLAYER_WALK);
                }
                this.direction = constants.UP;
            }
            else if (environment.is_pressed[constants.KEY_DOWN]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].down) {
                    this.pos.y = (this.pos.y + 1 + state.map.height) % state.map.height;
                    this.moving = constants.DOWN;
                    playSound(environment, constants.SOUND_PLAYER_WALK);
                }
                this.direction = 2;
            }
            else if (environment.is_pressed[constants.KEY_LEFT]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].left) {
                    this.pos.x = (this.pos.x - 1 + state.map.width) % state.map.width;
                    this.moving = true;
                    playSound(environment, constants.SOUND_PLAYER_WALK);
                }
                this.direction = constants.LEFT;
            }
            else if (environment.is_pressed[constants.KEY_RIGHT]) {
                current_pos = this.pos;
                if (state.map.cells[current_pos.y][current_pos.x].right) {
                    this.pos.x = (this.pos.x + 1 + state.map.width) % state.map.width;
                    this.moving = true;
                    playSound(environment, constants.SOUND_PLAYER_WALK);
                }
                this.direction = constants.RIGHT;
            }
        }
    }
    return player;
}

function hasDamage(state, pos) {
    for (var index = 0; index < state.damages.length; index++) {
        if (state.damages[index].pos.x === pos.x &&
           state.damages[index].pos.y === pos.y) {
            return true;
        }
    }
    return false;
}

function playSound(environment, index) {
    var source = environment.sound_context.createBufferSource();
    source.buffer = environment.sounds[index].sound;
    source.connect(environment.sound_context.destination);
    source.start(0);
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
        enemy.texture = map.enemies_images[map.enemies[index].id];
        enemy.draw = drawSprite;
        map.cells[enemy.pos.y][enemy.pos.x].occupied = true;
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

function bomberAction(environment, state) {
    this.frame_count += 1;
    if (this.moving) {
        if ((this.frame_count % 2) == 0) {
            this.movement_state += 1 / 8;
        }
        if (this.movement_state >= 1) {
            this.moving = false;
            this.movement_state = 0;
        }
        //if ((this.frame_count % 5) == 0) {
        //    this.state = (this.state + 1) % 2;
        //}
    }
    else {
        if ((this.frame_count % 25) == 0 && Math.random() > 0.8) {
            moveRandom(this, state.map, environment, constants.SOUND_BOMBER_WALK);
        }
        else if ((this.frame_count % 50) == 0 && Math.random() > 0.5) {
            playSound(environment, constants.SOUND_BOMB_DROP);
            state.objects.push(initBomb(state.map, this.pos));
        }
    }
}

function angryAction(environment, state) {
    this.frame_count += 1;
    if (this.moving) {
        if ((this.frame_count % 2) == 0) {
            this.movement_state += 1 / 8;
        }
        if (this.movement_state >= 1) {
            this.moving = false;
            this.movement_state = 0;
        }
        //if ((this.frame_count % 5) == 0) {
        //    this.state = (this.state + 1) % 2;
        //}
    }
    else {
        var potential_map = potentialMap(state);
        var min = state.map.height * state.map.width + 1;
        var final_pos = this.pos;
        var direction = constants.UP;
        if (state.map.cells[this.pos.y][this.pos.x].up) {
            var new_pos = (this.pos.y - 1 + state.map.height) % state.map.height;
            if (potential_map[new_pos][this.pos.x] < min) {
                min = potential_map[new_pos][this.pos.x];
                final_pos = {"x": this.pos.x, "y": new_pos};
                direction = constants.UP;
            }
        }
        if (state.map.cells[this.pos.y][this.pos.x].down) {
            var new_pos = (this.pos.y + 1) % state.map.height;
            if (potential_map[new_pos][this.pos.x] < min) {
                min = potential_map[new_pos][this.pos.x];
                final_pos = {"x": this.pos.x, "y": new_pos};
                direction = constants.DOWN;
            }
        }
        if (state.map.cells[this.pos.y][this.pos.x].left) {
            var new_pos = (this.pos.x - 1 + state.map.width) % state.map.width;
            if (potential_map[this.pos.y][new_pos] < min) {
                min = potential_map[this.pos.y][new_pos];
                final_pos = {"x": new_pos, "y": this.pos.y};
                direction = constants.LEFT;
            }
        }
        if (state.map.cells[this.pos.y][this.pos.x].right) {
            var new_pos = (this.pos.x + 1) % state.map.width;
            if (potential_map[this.pos.y][new_pos] < min) {
                min = potential_map[this.pos.y][new_pos];
                final_pos = {"x": new_pos, "y": this.pos.y};
                direction = constants.RIGHT;
            }
        }
        this.pos = final_pos;
        this.moving = true;
        this.direction = direction;
    }
}

function potentialMap(state) {
    var potential_map = [];
    for (var row = 0; row < state.map.height; row ++) {
        potential_map[row] = [];
        for (var col = 0; col < state.map.width; col++) {
            potential_map[row][col] = state.map.height * state.map.width + 1;
        }
    }
    var remaining = [state.player.pos];
    potential_map[state.player.pos.y][state.player.pos.x] = 0;
    while (remaining.length !== 0) {
        var current = remaining.pop();
        var value = potential_map[current.y][current.x] + 1;
        if (state.map.cells[current.y][current.x].up) {
            var new_pos = (current.y - 1 + state.map.height) % state.map.height;
            if (potential_map[new_pos][current.x] > value) {
                potential_map[new_pos][current.x] = value;
                remaining.push({"x": current.x, "y": new_pos});
            }
        }
        if (state.map.cells[current.y][current.x].down) {
            var new_pos = (current.y + 1) % state.map.height;
            if (potential_map[new_pos][current.x] > value) {
                potential_map[new_pos][current.x] = value;
                remaining.push({"x": current.x, "y": new_pos});
            }
        }
        if (state.map.cells[current.y][current.x].left) {
            var new_pos = (current.x - 1 + state.map.width) % state.map.width;
            if (potential_map[current.y][new_pos] > value) {
                potential_map[current.y][new_pos] = value;
                remaining.push({"x": new_pos, "y": current.y});
            }
        }
        if (state.map.cells[current.y][current.x].right) {
            var new_pos = (current.x + 1) % state.map.width;
            if (potential_map[current.y][new_pos] > value) {
                potential_map[current.y][new_pos] = value;
                remaining.push({"x": new_pos, "y": current.y});
            }
        }
    }
    return potential_map;
}



function fastAction(environment, state) {
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
                playSound(environment, constants.SOUND_FAST_RUN);
            }
            else if (down) {
                this.pos.y = (this.pos.y + 1) % state.map.height;
                this.moving = true;
                this.running = true;
                this.direction = constants.DOWN;
                playSound(environment, constants.SOUND_FAST_RUN);
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
                playSound(environment, constants.SOUND_FAST_RUN);
            }
            else if (right) {
                this.pos.x = (this.pos.x + 1) % state.map.width;
                this.moving = true;
                this.running = true;
                this.direction = constants.RIGHT;
                playSound(environment, constants.SOUND_FAST_RUN);
            }
        }
        if (!this.moving && (this.frame_count % 10 == 0) && Math.random() > 0.8) {
            moveRandom(this, state.map, environment, constants.SOUND_FAST_WALK);
        }
    }
}

function moveRandom(sprite, map, environment, sound) {
    var direction = Math.floor(Math.random() * 4);
    var new_pos;
    switch (direction) {
        case constants.UP:
            new_pos = (sprite.pos.y - 1 + map.height) % map.height;
            if (map.cells[sprite.pos.y][sprite.pos.x].up && !map.cells[new_pos][sprite.pos.x].occupied) {
                map.cells[sprite.pos.y][sprite.pos.x].occupied = false;
                sprite.pos.y = new_pos;
                map.cells[sprite.pos.y][sprite.pos.x].occupied = true;
                sprite.moving = true;
                playSound(environment, sound);
            }
            sprite.direction = constants.UP;
            break;
        case constants.DOWN:
            new_pos = (sprite.pos.y + 1) % map.height;
            if (map.cells[sprite.pos.y][sprite.pos.x].down && !map.cells[new_pos][sprite.pos.x].occupied) {
                map.cells[sprite.pos.y][sprite.pos.x].occupied = false;
                sprite.pos.y = new_pos;
                map.cells[sprite.pos.y][sprite.pos.x].occupied = true;
                sprite.moving = true;
                playSound(environment, sound);
            }
            sprite.direction = constants.DOWN;
            break;
        case constants.LEFT:
            new_pos = (sprite.pos.x - 1 + map.width) % map.width;
            if (map.cells[sprite.pos.y][sprite.pos.x].left && !map.cells[sprite.pos.y][new_pos].occupied) {
                map.cells[sprite.pos.y][sprite.pos.x].occupied = false;
                sprite.pos.x = new_pos;
                map.cells[sprite.pos.y][sprite.pos.x].occupied = true;
                sprite.moving = true;
                playSound(environment, sound);
            }
            sprite.direction = constants.LEFT;
            break;
        case constants.RIGHT:
            new_pos = (sprite.pos.x + 1) % map.width;
            if (map.cells[sprite.pos.y][sprite.pos.x].right && !map.cells[sprite.pos.y][new_pos].occupied) {
                map.cells[sprite.pos.y][sprite.pos.x].occupied = false;
                sprite.pos.x = new_pos;
                map.cells[sprite.pos.y][sprite.pos.x].occupied = true;
                sprite.moving = true;
                playSound(environment, sound);
            }
            sprite.direction = constants.RIGHT;
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
