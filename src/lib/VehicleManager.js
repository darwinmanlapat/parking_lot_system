class VehicleManager {
    constructor(vehicles, unparkedVehicles = []) {
        this._vehicles = vehicles;
        this._unparkedVehicles = unparkedVehicles;
    }

    isReturningVehicle(vehicle) {
        return !!this.getReturningVehicle(vehicle);
    }

    getReturningVehicle(vehicle) {
        if (this._unparkedVehicles.length === 0) {
            return false;
        }

        return this._unparkedVehicles.filter((unParkedVehicle) => {
            return (
                unParkedVehicle.license === vehicle.license &&
                VehicleManager.getTimeDifference(vehicle.timeIn, unParkedVehicle.timeOut) <= 1
            );
        })[0];
    }

    getVehicleByPosition(rowIndex, columnIndex) {
        if (this._vehicles.length === 0) {
            return null;
        }

        return this._vehicles.filter(vehicle =>
            vehicle.coordinates.rowIndex === rowIndex &&
            vehicle.coordinates.columnIndex === columnIndex
        )[0];
    }

    static getTimeDifference(timeIn, timeOut) {
        return Math.ceil((new Date(timeOut) - new Date(timeIn)) / (1000 * 60 * 60));
    }
}

export default VehicleManager;