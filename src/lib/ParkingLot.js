import { Size } from "../enums/Size";

const BASE_RATE = 40;

const HOURLY_RATE = {
    [Size.SMALL]: 20,
    [Size.MEDIUM]: 60,
    [Size.LARGE]: 100,
}

const DAILY_RATE = 5000;
class ParkingLot {
    constructor(parkingSlotSizes, vehicles, unparkedVehicles) {
        this._unparkedVehicles = unparkedVehicles;
        this._parkingSlotSizes = parkingSlotSizes;
        this._vehicles = vehicles;
    }

    parkVehicle(selectedEntryPoint, vehicle) {
        const returningVehicleIndex = this._unparkedVehicles.findIndex((unParkedVehicle) => {
            return unParkedVehicle.license === vehicle.license && ParkingLot.getTimeDifference(vehicle.timeIn, unParkedVehicle.timeOut) <= 1;
        });

        console.log('returningVehicle', returningVehicleIndex >= 0 ? this._unparkedVehicles[returningVehicleIndex] : null);

        const parkingSlotCoordinates = this.#possibleParkingSlots(vehicle.size);

        const availableSlot = this.#findClosestAvailableSlot(selectedEntryPoint, parkingSlotCoordinates);

        if (availableSlot) {
            // const adjustedVehicle = vehicle;

            // Replace the returning vehicle's time in with its previous time in to simulate the continuous rate
            if (returningVehicleIndex >= 0) {
                // adjustedVehicle.timeIn = this._unparkedVehicles[returningVehicleIndex].timeIn;

                // const adjustedUnparkedVehicles = [...this._unparkedVehicles];

                // adjustedUnparkedVehicles.splice(returningVehicleIndex, 1);

                // setUnparkedVehicles(...adjustedUnparkedVehicles);
            }

            return availableSlot;
        } else {
            return null;
        }
    }

    unparkVehicle(vehicle) {
        const parkedVehicleSlotSize = ParkingLot.getParkingSlotSize(vehicle.coordinates.rowIndex, vehicle.coordinates.columnIndex, this._parkingSlotSizes);

        return this.#calculateFee(vehicle, parkedVehicleSlotSize)
    }

    static getParkingSlotSize(rowIndex, columnIndex, parkingSlotSizes) {
        const { [Size.SMALL]: small, [Size.MEDIUM]: medium } = parkingSlotSizes;
    
        const previousSize = small.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
            ? Size.SMALL
            : medium.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
                ? Size.MEDIUM
                : Size.LARGE;
    
        return previousSize;
    }

    static getTimeDifference(timeIn, timeOut) {
        return Math.ceil((new Date(timeOut) - new Date(timeIn)) / (1000 * 60 * 60))
    }

    #calculateDistance(point1, point2) {
        const dx = Math.abs(point1.rowIndex - point2.rowIndex);
        const dy = Math.abs(point1.columnIndex - point2.columnIndex);
        return Math.max(dx, dy);
    };

    #calculateFee(vehicle, parkedVehicleSlotSize) {
        const { timeIn, timeOut } = vehicle;
        const timeDiff = ParkingLot.getTimeDifference(timeIn, timeOut); // hours rounded up
        const full24Hour = Math.floor(timeDiff / 24);
        const remainderHours = timeDiff % 24;
        const full24HoursFee = full24Hour * DAILY_RATE;

        let exceedingHoursFee = Math.max(timeDiff - 3, 0) * HOURLY_RATE[parkedVehicleSlotSize];

        // We compute the exceeding differently for 24-hour+ parking vs below 24-hour parking
        if (full24Hour > 0) {
            exceedingHoursFee = remainderHours * HOURLY_RATE[parkedVehicleSlotSize];
        }

        let fee = exceedingHoursFee + full24HoursFee;

        // Only add the base rate for parking durations of less than 24 hours
        if (timeDiff < 24 && timeDiff > 0) {
            fee += BASE_RATE;
        }

        return fee;
    }

    #findClosestAvailableSlot(entryPoint, parkingSlotCoordinates) {
        let closestSlot = null;
        let minDistance = Infinity;

        for (let coordinates of parkingSlotCoordinates) {
            const distance = this.#calculateDistance(entryPoint, coordinates);
            if (distance < minDistance && !this.#isSlotOccupied(coordinates)) {
                minDistance = distance;
                closestSlot = coordinates;
            }
        }

        return closestSlot;
    };

    #isSlotOccupied(coordinates) {
        return this._vehicles.some((vehicle) => vehicle.coordinates.rowIndex === coordinates.rowIndex && vehicle.coordinates.columnIndex === coordinates.columnIndex);
    };

    #possibleParkingSlots(vehicleSize) {
        const smallSlots = this._parkingSlotSizes[Size.SMALL];
        const mediumSlots = this._parkingSlotSizes[Size.MEDIUM];
        const largeSlots = this._parkingSlotSizes[Size.LARGE];

        if (vehicleSize === Size.SMALL) {
            return smallSlots.concat(mediumSlots, largeSlots);
        }

        if (vehicleSize === Size.MEDIUM) {
            return mediumSlots.concat(largeSlots);
        }

        if (vehicleSize === Size.LARGE) {
            return largeSlots;
        }
    };
}

export default ParkingLot;