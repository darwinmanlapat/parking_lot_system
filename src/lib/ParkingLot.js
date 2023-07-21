import config from "../config";
import ParkingFeeCalculator from "./ParkingFeeCalculator";
import ParkingSlot from "./ParkingSlot";
import { isEqual, sortBy } from "lodash";

/**
 * A class representing a parking lot and its associated operations.
 */
class ParkingLot {
    /**
     * Creates an instance of ParkingLot.
     * 
     * @param {Object} parkingSlotSizes - An object containing parking slot sizes.
     * @param {Array} [vehicles=[]] - An array of parked vehicles in the parking lot.
     * @param {Array} [unparkedVehicles=[]] - An array of unparked vehicles in the parking lot.
     */
    constructor(parkingSlotSizes, vehicles = [], unparkedVehicles = []) {
        this._unparkedVehicles = unparkedVehicles;
        this._parkingSlot = new ParkingSlot(parkingSlotSizes);
        this._vehicles = vehicles;
    }

    /**
     * Parks a vehicle in the closest available slot from the selected entry point.
     * 
     * @param {Object} selectedEntryPoint - The selected entry point object coordinates.
     * @param {string} vehicleSize - The size of the vehicle (S, M, or L).
     * 
     * @returns {Object | null} The coordinates of the closest available parking slot if found, otherwise null.
     */
    parkVehicle(selectedEntryPoint, vehicleSize) {
        return this.#findClosestAvailableSlot(selectedEntryPoint, sortBy(this._parkingSlot.getPossibleSlots(vehicleSize), ['rowIndex', 'columnIndex']));
    }

    /**
     * Unparks a vehicle and calculates the parking fee based on its parked slot size.
     * 
     * @param {Object} vehicle - The vehicle object to unpark.
     * 
     * @returns {number} The calculated parking fee for the vehicle.
     */
    unparkVehicle(vehicle) {
        const parkedVehicleSlotSize = this._parkingSlot.getSizeByCoordinates(
            vehicle.coordinates.rowIndex,
            vehicle.coordinates.columnIndex,
        );

        return ParkingFeeCalculator.calculateFee(vehicle, parkedVehicleSlotSize);
    }

    /**
     * Checks if a given slot coordinates represent an entry point in the parking lot.
     * 
     * @param {Array} entryPoints - An array of entry point objects with rowIndex and columnIndex.
     * @param {number} rowIndex - The row index of the slot to check.
     * @param {number} columnIndex - The column index of the slot to check.
     * 
     * @returns {boolean} True if the slot is an entry point, false otherwise.
     */
    static isEntryPoint(entryPoints, rowIndex, columnIndex) {
        return entryPoints.some(entryPoint => isEqual(entryPoint, {rowIndex, columnIndex}));
    }

    /**
     * Calculates the distance between two points represented by their coordinates.
     * 
     * @param {Object} point1 - The first point object with coordinates.
     * @param {Object} point2 - The second point object with coordinates.
     * 
     * @returns {number} The distance between the two points.
     * 
     * @private
     */
    #calculateDistance(point1, point2) {
        const horizontalDifference = Math.abs(point1.rowIndex - point2.rowIndex);
        const verticalDifference = Math.abs(point1.columnIndex - point2.columnIndex);

        return Math.max(horizontalDifference, verticalDifference);
    }

    /**
     * Finds the closest available parking slot from the entry point among the given parking slot coordinates.
     * 
     * @param {Object} entryPoint - The selected entry point object with coordinates.
     * @param {Array} parkingSlotCoordinates - An array of parking slot coordinates to search from.
     * 
     * @returns {Object | null} The coordinates of the closest available parking slot if found, otherwise null.
     * 
     * @private
     */
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

    /**
     * Checks if a parking slot is occupied by a vehicle.
     * 
     * @param {Object} coordinates - The coordinates of the parking slot to check.
     * 
     * @returns {boolean} True if the slot is occupied, false otherwise.
     * 
     * @private
     */
    #isSlotOccupied(coordinates) {
        return this._vehicles.some(vehicle => isEqual(vehicle.coordinates, coordinates));
    }
}

export default ParkingLot;
