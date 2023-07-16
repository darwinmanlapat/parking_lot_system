class ParkingLot {    
    constructor(entryPoints, parkingMap) {
        this._entryPoints = entryPoints;
        // this._parkingSlots = parkingSlots;
        this._map = parkingMap;
    }

    // get getMap() {
    //     return this._map;
    // }

    // /**
    //  * @param {Array} parkingMap
    //  */
    // set setMap(parkingMap) {
    //     this._map = parkingMap;
    // }

    parkVehicle(vehicle) {
        const entryPointDistances = this.parkingSlots.map(slot => slot.slotNumber);
        const closestEntryPoint = entryPointDistances.indexOf(Math.min(...entryPointDistances));
        const availableSlots = this.parkingSlots.filter(slot => !slot.isOccupied && slot.slotType.includes(this.vehicleMap[vehicle.vehicleType]));

        if (availableSlots.length === 0) {
            console.log("No available slots for parking.");
            return;
        }

        const closestSlot = availableSlots.reduce((closest, slot) => {
            const slotDistance = Math.abs(slot.slotNumber - closestEntryPoint);
            return slotDistance < Math.abs(closest.slotNumber - closestEntryPoint) ? slot : closest;
        });

        closestSlot.allocate(vehicle);
        console.log(`Vehicle ${vehicle.licensePlateNumber} parked at Slot ${closestSlot.slotNumber}`);
    }

    unparkVehicle(vehicle) {
        const slot = this.parkingSlots.find(slot => slot.isOccupied && slot.vehicle === vehicle);
        if (!slot) {
            console.log("Vehicle is not parked in the parking lot.");
            return;
        }

        const entryTime = slot.vehicle.entryTime;
        const exitTime = new Date();
        const fee = this.calculateFee(entryTime, exitTime, vehicle.vehicleType, slot.slotType);

        slot.free();
        console.log(`Vehicle ${vehicle.licensePlateNumber} has been unparked. Fee: ${fee} pesos.`);

        return fee;
    }

    calculateFee(entryTime, exitTime, vehicleType, slotType) {
        const timeDiff = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60)); // hours rounded up
        const baseRate = 40;

        let exceedingHourlyRate = 0;
        if (slotType === "SP") exceedingHourlyRate = 20;
        else if (slotType === "MP") exceedingHourlyRate = 60;
        else if (slotType === "LP") exceedingHourlyRate = 100;

        const exceedingHoursFee = Math.max(timeDiff - 3, 0) * exceedingHourlyRate;
        const full24HoursFee = Math.floor(timeDiff / 24) * 5000;
        const remainderHoursFee = (timeDiff % 24) * exceedingHourlyRate;

        const fee = baseRate + exceedingHoursFee + full24HoursFee + remainderHoursFee;

        return fee;
    }
}

export default ParkingLot;