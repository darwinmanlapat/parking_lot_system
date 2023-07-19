import { Size } from "../enums/Size";
import VehicleManager from "./VehicleManager";

const BASE_RATE = 40;
const HOURLY_RATE = {
    [Size.SMALL]: 20,
    [Size.MEDIUM]: 60,
    [Size.LARGE]: 100,
};
const DAILY_RATE = 5000;

class ParkingFeeCalculator {
    static calculateFee(vehicle, parkedVehicleSlotSize) {
        const { timeIn, timeOut } = vehicle;
        const timeDiff = VehicleManager.getTimeDifference(timeIn, timeOut); // hours rounded up
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
}

export default ParkingFeeCalculator;