package me.arzcbnh.adventofcode.day.day6;

import java.util.List;
import me.arzcbnh.adventofcode.util.Listx;

final class LaboratoryMap {
    private final List<List<Tile>> tiles;

    public LaboratoryMap(List<List<Character>> scheme) {
        this.tiles = scheme.stream()
                .map(line -> line.stream().map(Tile::new).toList())
                .toList();
    }

    public void setObstacle(Listx.Index2D index) {
        tiles.get(index.y()).get(index.x()).isObstacle = true;
    }

    public int visitTile(Listx.Index2D index) {
        var tile = tiles.get(index.y()).get(index.x());
        return tile.visit();
    }

    public boolean isIndexOutOfBounds(Listx.Index2D index) {
        int x = index.x();
        int y = index.y();
        return x < 0 || y < 0 || x >= tiles.getFirst().size() || y >= tiles.size();
    }

    public boolean isIndexObstructed(Listx.Index2D index) {
        int x = index.x();
        int y = index.y();
        return tiles.get(y).get(x).isObstacle;
    }

    public void reset() {
        Listx.forEach2D(tiles, Tile::reset);
    }
}
