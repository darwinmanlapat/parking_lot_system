import ParkingFeeCalculator from "./ParkingFeeCalculator";
import { isEmpty, isEqual, isEqualWith, isNull, isNil } from "lodash";

/**
 * A class that manages vehicles and unparked vehicles in a parking lot system.
 */
class VehicleManager {
    /**
     * Creates an instance of VehicleManager.
     * 
     * @param {Array} parkedVehicles - An array of parked vehicles in the parking lot.
     * @param {Array} [unparkedVehicles=[]] - An array of unparked vehicles in the parking lot.
     */
    constructor(parkedVehicles, unparkedVehicles = []) {
        this._parkedVehicles = parkedVehicles;
        this._unparkedVehicles = unparkedVehicles;
    }

    /**
     * Checks if a vehicle is parked in the parking lot.
     * 
     * @param {object} vehicle - The vehicle object to check.
     * 
     * @returns {boolean} - True if the vehicle is parked, false otherwise.
     */
    isParked(vehicle) {
        if (isEmpty(this._parkedVehicles)) {
            return false;
        }

        // Check if there is a similar object in the parked vehicle array but don't check for the timeOut property
        return this._parkedVehicles.some(parkedVehicle => {
            return isEqualWith(parkedVehicle, vehicle, (value1, value2, key) => {
                return key === "timeOut" ? true : undefined;
            });
        });
    }

    /**
     * Checks if a given vehicle is a returning vehicle.
     * 
     * @param {Object} vehicle - The vehicle object to check.
     * 
     * @returns {boolean} True if the vehicle is returning, false otherwise.
     */
    isReturningVehicle(vehicle) {
        return !isNil(this.getReturningVehicle(vehicle));
    }

    /**
     * Checks if a vehicle is valid with complete details for parking and unparking.
     * 
     * @param {object} vehicle - The vehicle object to check.
     * 
     * @returns {boolean} - True if the vehicle is valid, false otherwise.
     */
    isValidVehicle(vehicle) {
        if (isNull(vehicle)) {
            return false;
        }

        if (this.isParked(vehicle)) {
            return !isEmpty(vehicle.timeOut);
        } else {
            return !isEmpty(vehicle.timeIn, vehicle.license, vehicle.size);
        }
    }

    /**
     * Gets the returning vehicle, if any, for a given vehicle.
     * 
     * @param {Object} vehicle - The vehicle object to check for returning status.
     * 
     * @returns {Object | null} The returning vehicle if found, null otherwise.
     */
    getReturningVehicle(vehicle) {
        if (isEmpty(this._unparkedVehicles)) {
            return null;
        }

        // Get the unparked vehicle that has the same license and has timed out within 1 hour
        return this._unparkedVehicles.filter((unParkedVehicle) => {
            return (
                unParkedVehicle.license === vehicle.license &&
                ParkingFeeCalculator.getTimeDifference(vehicle.timeIn, unParkedVehicle.timeOut) <= 1
            );
        })[0];
    }

    /**
     * Gets a vehicle by its position in the parking lot.
     * 
     * @param {number} rowIndex - The row index of the parking slot.
     * @param {number} columnIndex - The column index of the parking slot.
     * 
     * @returns {Object | null} The vehicle object if found, null otherwise.
     */
    getVehicleByPosition(rowIndex, columnIndex) {
        if (isEmpty(this._parkedVehicles)) {
            return null;
        }

        return this._parkedVehicles.filter(vehicle =>
            isEqual(vehicle.coordinates, {rowIndex, columnIndex})
        )[0];
    }
}

export default VehicleManager;