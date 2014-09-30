function initEnvironment() {
    var environment = {};
    environment.layers = [];
    environment.layers[0] = document.getElementById("backLayer").getContext("2d");
    environment.layers[1] = document.getElementById("mainLayer").getContext("2d");
    environment.layers[2] = document.getElementById("frontLayer").getContext("2d");
    environment.height = environment.layers[0].canvas.height;
    environment.width = environment.layers[0].canvas.width;

    environment.is_pressed = {};

    environment.sounds = loadSounds();
    environment.sound_context = new AudioContext();

    initMenuLoop(environment, {});
}

function tick(environment, game_state) {
    environment.animate(environment, game_state);
    environment.draw(environment, game_state);
    setTimeout(function () {
        tick(environment, game_state);
    }, constants.FRAME_TIME);
}

function loadSounds() {
    var context = new AudioContext();
    var sounds = {};
    sounds[constants.SOUND_PLAYER_WALK] = {"ready":false};
    var request = new XMLHttpRequest();
    request.open("GET", "sfx/PLAYER_WALK.ogg", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        if (this.readyState == 4) {
            context.decodeAudioData(this.response, function(buffer) {
                sounds[constants.SOUND_PLAYER_WALK].ready = true;
                sounds[constants.SOUND_PLAYER_WALK].sound = buffer;
            }, function() {});
        }
    }
    request.send();
    sounds[constants.SOUND_BOMB_DROP] = {"ready":false};
    request = new XMLHttpRequest();
    request.open("GET", "sfx/BOMB_DROP.ogg", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        if (this.readyState == 4) {
            context.decodeAudioData(this.response, function(buffer) {
                sounds[constants.SOUND_BOMB_DROP].ready = true;
                sounds[constants.SOUND_BOMB_DROP].sound = buffer;
            }, function() {});
        }
    }
    request.send();
    sounds[constants.SOUND_BOMB_EXPLODE] = {"ready":false};
    request = new XMLHttpRequest();
    request.open("GET", "sfx/BOMB_EXPLODE.ogg", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        if (this.readyState == 4) {
            context.decodeAudioData(this.response, function(buffer) {
                sounds[constants.SOUND_BOMB_EXPLODE].ready = true;
                sounds[constants.SOUND_BOMB_EXPLODE].sound = buffer;
            }, function() {});
        }
    }
    request.send();
    sounds[constants.SOUND_KOG_GET] = {"ready":false};
    request = new XMLHttpRequest();
    request.open("GET", "sfx/KOG_GET.ogg", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        if (this.readyState == 4) {
            context.decodeAudioData(this.response, function(buffer) {
                sounds[constants.SOUND_KOG_GET].ready = true;
                sounds[constants.SOUND_KOG_GET].sound = buffer;
            }, function() {});
        }
    }
    request.send();
    sounds[constants.SOUND_BOMBER_WALK] = {"ready":false};
    request = new XMLHttpRequest();
    request.open("GET", "sfx/BOMBER_WALK.ogg", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        if (this.readyState == 4) {
            context.decodeAudioData(this.response, function(buffer) {
                sounds[constants.SOUND_BOMBER_WALK].ready = true;
                sounds[constants.SOUND_BOMBER_WALK].sound = buffer;
            }, function() {});
        }
    }
    request.send();
    return sounds;
}
