import config from "../config";

/**
 * A utility class for calculating parking fees based on vehicle details and parked vehicle slot size.
 */
class ParkingFeeCalculator {
    /**
     * Calculates the parking fee for a given vehicle based on the parked vehicle slot size.
     * 
     * @param {Object} vehicle - The vehicle object to calculate the fee for.
     * @param {string} parkedVehicleSlotSize - The size of the parked vehicle slot (S, M, or L).
     * 
     * @returns {number} The calculated parking fee for the vehicle.
     * 
     * @static
     */
    static calculateFee(vehicle, parkedVehicleSlotSize) {
        const timeDiff = ParkingFeeCalculator.getTimeDifference(vehicle.timeIn, vehicle.timeOut); // hours rounded up
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

    /**
     * Calculates the time difference in hours between two time values.
     * 
     * @param {string} timeIn - The entry time in ISO string format.
     * @param {string} timeOut - The exit time in ISO string format.
     * 
     * @returns {number} The time difference in hours rounded up.
     */
    static getTimeDifference(timeIn, timeOut) {
        return Math.ceil((new Date(timeOut) - new Date(timeIn)) / (1000 * 60 * 60));
    }
}

export default ParkingFeeCalculator;