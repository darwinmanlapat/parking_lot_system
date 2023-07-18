class ParkingMap {
    map = [];

    constructor(tableSize) {
        this.map = Array.from({ length: tableSize }, () => Array(tableSize).fill(null));

        return this;
    }

    getMap() {
        return this.map;
    }
}

export default ParkingMap;