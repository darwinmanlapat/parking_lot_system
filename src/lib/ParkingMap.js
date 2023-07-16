class ParkingMap {
    map = [];

    constructor(numRows, numColumns) {
        this.map = Array.from({ length: numRows }, () => Array(numColumns).fill(null));

        return this;
    }

    getMap() {
        return this.map;
    }
}

export default ParkingMap;