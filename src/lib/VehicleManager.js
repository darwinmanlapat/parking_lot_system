class VehicleManager {
    constructor(vehicles, unparkedVehicles) {
        this._vehicles = vehicles;
        this._unparkedVehicles = unparkedVehicles;
    }

    isReturningVehicle(vehicle) {
        const returningVehicleIndex = this._unparkedVehicles.findIndex((unParkedVehicle) => {
            return (
                unParkedVehicle.license === vehicle.license &&
                VehicleManager.getTimeDifference(vehicle.timeIn, unParkedVehicle.timeOut) <= 1
            );
        });

        console.log(
            'returningVehicle',
            returningVehicleIndex >= 0 ? this._unparkedVehicles[returningVehicleIndex] : null
        );

        return returningVehicleIndex;
    }

    static getTimeDifference(timeIn, timeOut) {
        return Math.ceil((new Date(timeOut) - new Date(timeIn)) / (1000 * 60 * 60));
    }
}

export default VehicleManager;