import ParkingFeeCalculator from "./ParkingFeeCalculator";

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
     * Checks if a given vehicle is a returning vehicle.
     * 
     * @param {Object} vehicle - The vehicle object to check.
     * 
     * @returns {boolean} True if the vehicle is returning, false otherwise.
     */
    isReturningVehicle(vehicle) {
        return !!this.getReturningVehicle(vehicle);
    }

    /**
     * Gets the returning vehicle, if any, for a given vehicle.
     * 
     * @param {Object} vehicle - The vehicle object to check for returning status.
     * 
     * @returns {Object | boolean} The returning vehicle if found, otherwise false.
     */
    getReturningVehicle(vehicle) {
        if (this._unparkedVehicles.length === 0) {
            return false;
        }

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
        if (this._parkedVehicles.length === 0) {
            return null;
        }

        return this._parkedVehicles.filter(vehicle =>
            vehicle.coordinates.rowIndex === rowIndex &&
            vehicle.coordinates.columnIndex === columnIndex
        )[0];
    }
}

export default VehicleManager;