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
                kog.texture = map.objects_images[0];
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
