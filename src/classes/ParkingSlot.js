class ParkingSlot {
    constructor(slotNumber, slotType) {
        this.slotNumber = slotNumber;
        this.slotType = slotType;
        this.isOccupied = false;
        this.vehicle = null;
    }

    allocate(vehicle) {
        this.isOccupied = true;
        this.vehicle = vehicle;
    }

    free() {
        this.isOccupied = false;
        this.vehicle = null;
    }
}

export default ParkingSlot;