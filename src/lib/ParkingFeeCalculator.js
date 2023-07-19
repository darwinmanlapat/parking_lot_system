import config from "../config";
import VehicleManager from "./VehicleManager";

class ParkingFeeCalculator {
    static calculateFee(vehicle, parkedVehicleSlotSize) {
        const { timeIn, timeOut } = vehicle;
        const timeDiff = VehicleManager.getTimeDifference(timeIn, timeOut); // hours rounded up
        const full24Hour = Math.floor(timeDiff / 24);
        const remainderHours = timeDiff % 24;
        const full24HoursFee = full24Hour * config.DAILY_RATE;

        let exceedingHoursFee = Math.max(timeDiff - config.BASE_HOUR, 0) * config.HOURLY_RATE[parkedVehicleSlotSize];

        // We compute the exceeding differently for 24-hour+ parking vs below 24-hour parking
        if (full24Hour > 0) {
            exceedingHoursFee = remainderHours * config.HOURLY_RATE[parkedVehicleSlotSize];
        }

        let fee = exceedingHoursFee + full24HoursFee;

        // Only add the base rate for parking durations of less than 24 hours
        if (timeDiff < 24 && timeDiff > 0) {
            fee += config.BASE_RATE;
        }

        return fee;
    }
}

export default ParkingFeeCalculator;