import config from "../config";
import ParkingFeeCalculator from "./ParkingFeeCalculator";
import ParkingSlot from "./ParkingSlot";
import { isEqual, sortBy } from "lodash";


class ParkingLot {
  
    constructor(parkingSlotSizes, vehicles = [], unparkedVehicles = []) {
        this._unparkedVehicles = unparkedVehicles;
        this._parkingSlot = new ParkingSlot(parkingSlotSizes);
        this._vehicles = vehicles;
    }


    parkVehicle(selectedEntryPoint, vehicleSize) {
        return this.#findClosestAvailableSlot(selectedEntryPoint, sortBy(this._parkingSlot.getPossibleSlots(vehicleSize), ['rowIndex', 'columnIndex']));
    }


    unparkVehicle(vehicle) {
        const parkedVehicleSlotSize = this._parkingSlot.getSizeByCoordinates(
            vehicle.coordinates.rowIndex,
            vehicle.coordinates.columnIndex,
        );

        return ParkingFeeCalculator.calculateFee(vehicle, parkedVehicleSlotSize);
    }


    static isEntryPoint(entryPoints, rowIndex, columnIndex) {
        return entryPoints.some(entryPoint => isEqual(entryPoint, {rowIndex, columnIndex}));
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
        return this._vehicles.some(vehicle => isEqual(vehicle.coordinates, coordinates));
    }
}

export default ParkingLot;
