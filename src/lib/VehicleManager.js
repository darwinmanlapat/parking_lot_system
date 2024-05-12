import { isEmpty, isEqual, isEqualWith, isNil, isNull } from "lodash";
import ParkingFeeCalculator from "./ParkingFeeCalculator";

class VehicleManager {
	constructor(parkedVehicles, unparkedVehicles = []) {
		this._parkedVehicles = parkedVehicles;
		this._unparkedVehicles = unparkedVehicles;
	}

	isParked(vehicle, isSubmitted = false) {
		if (isEmpty(this._parkedVehicles)) {
			return false;
		}

		return this._parkedVehicles.some((parkedVehicle) => {
			return isEqualWith(parkedVehicle, vehicle, (value1, value2, key) => {
				return (isSubmitted &&
					(key === "timeIn" || key === "coordinates" || key === "size")) ||
					key === "timeOut"
					? true
					: undefined;
			});
		});
	}

	isReturningVehicle(vehicle) {
		return !isNil(this.getReturningVehicle(vehicle));
	}

	isValidVehicle(vehicle) {
		if (isNull(vehicle)) {
			return false;
		}

		if (this.isParked(vehicle)) {
			return !isEmpty(vehicle.timeOut) && vehicle.timeIn <= vehicle.timeOut;
		} else {
			return (
				!isEmpty(vehicle.timeIn, vehicle.license, vehicle.size) &&
				this.#isValidLicense(vehicle.license)
			);
		}
	}

	getReturningVehicle(vehicle) {
		if (isEmpty(this._unparkedVehicles)) {
			return null;
		}

		return this._unparkedVehicles.filter((unParkedVehicle) => {
			return (
				unParkedVehicle.license === vehicle.license &&
				ParkingFeeCalculator.getTimeDifference(
					vehicle.timeIn,
					unParkedVehicle.timeOut
				) === 1
			);
		})[0];
	}

	getVehicleByPosition(rowIndex, columnIndex) {
		if (isEmpty(this._parkedVehicles)) {
			return null;
		}

		return this._parkedVehicles.filter((vehicle) =>
			isEqual(vehicle.coordinates, { rowIndex, columnIndex })
		)[0];
	}

	#isValidLicense(license) {
		return /^[A-Z]{3}-\d{4}$/.test(license);
	}
}

export default VehicleManager;
