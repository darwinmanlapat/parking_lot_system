import config from "../config";
import { Size } from "../enums/Size";
import ParkingFeeCalculator from "./ParkingFeeCalculator";

class ParkingLot {
    constructor(parkingSlotSizes, vehicles = [], unparkedVehicles = []) {
        this._unparkedVehicles = unparkedVehicles;
        this._parkingSlotSizes = parkingSlotSizes;
        this._vehicles = vehicles;
    }

    parkVehicle(selectedEntryPoint, vehicleSize) {
        return this.#findClosestAvailableSlot(selectedEntryPoint, this.#possibleParkingSlots(vehicleSize));
    }

    unparkVehicle(vehicle) {
        const parkedVehicleSlotSize = this.getParkingSlotSize(
            vehicle.coordinates.rowIndex,
            vehicle.coordinates.columnIndex,
            this._parkingSlotSizes
        );

        return ParkingFeeCalculator.calculateFee(vehicle, parkedVehicleSlotSize);
    }

    getParkingSlotSize(rowIndex, columnIndex) {
        const { [Size.SMALL]: small, [Size.MEDIUM]: medium } = this._parkingSlotSizes;
        const isSmall = small.some(slot =>
            slot.rowIndex === rowIndex && slot.columnIndex === columnIndex
        );
        const isMedium = medium.some(slot =>
            slot.rowIndex === rowIndex && slot.columnIndex === columnIndex
        );

        if (isSmall) {
            return Size.SMALL;
        }

        if (isMedium) {
            return Size.MEDIUM;
        }

        return Size.LARGE;
    }

    updateParkingSlotSizes(rowIndex, columnIndex, parkingSlotSize) {
        const previousSize = this.getParkingSlotSize(rowIndex, columnIndex);

        this._parkingSlotSizes[previousSize] = this._parkingSlotSizes[previousSize].filter(coord =>
            coord.rowIndex !== rowIndex || coord.columnIndex !== columnIndex
        );

        this._parkingSlotSizes[parkingSlotSize] = [...this._parkingSlotSizes[parkingSlotSize], { rowIndex, columnIndex }];

        return this._parkingSlotSizes;
    }

    static isEntryPoint(entryPoints, rowIndex, columnIndex) {
        return entryPoints.some(entryPoint =>
            entryPoint.rowIndex === rowIndex &&
            entryPoint.columnIndex === columnIndex
        );
    }

    #calculateDistance(point1, point2) {
        const horizontalDifference = Math.abs(point1.rowIndex - point2.rowIndex);
        const verticalDifference = Math.abs(point1.columnIndex - point2.columnIndex);

        return Math.max(horizontalDifference, verticalDifference);
    }

    #findClosestAvailableSlot(entryPoint, parkingSlotCoordinates) {
        let closestSlot = null;
        let minDistance = config.MAX_TABLE_SIZE;

        for (let coordinates of parkingSlotCoordinates) {
            const distance = this.#calculateDistance(entryPoint, coordinates);

            if (distance < minDistance && !this.#isSlotOccupied(coordinates)) {
                minDistance = distance;
                closestSlot = coordinates;
            }
        }

        return closestSlot;
    }

    #isSlotOccupied(coordinates) {
        return this._vehicles.some(vehicle =>
            vehicle.coordinates.rowIndex === coordinates.rowIndex &&
            vehicle.coordinates.columnIndex === coordinates.columnIndex
        );
    }

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
    }
}

export default ParkingLot;
