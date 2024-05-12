import config from "../config";


class ParkingFeeCalculator {

    static calculateFee(vehicle, parkedVehicleSlotSize) {
        const timeDiff = ParkingFeeCalculator.getTimeDifference(vehicle.timeIn, vehicle.timeOut); // hours rounded up
        const full24Hour = Math.floor(timeDiff / 24);
        const remainderHours = timeDiff % 24;
        const full24HoursFee = full24Hour * config.DAILY_RATE;

        let exceedingHoursFee = Math.max(timeDiff - config.BASE_HOUR, 0) * config.HOURLY_RATE[parkedVehicleSlotSize];

        if (full24Hour > 0) {
            exceedingHoursFee = remainderHours * config.HOURLY_RATE[parkedVehicleSlotSize];
        }

        let fee = exceedingHoursFee + full24HoursFee;

        if (timeDiff < 24 && timeDiff > 0) {
            fee += config.BASE_RATE;
        }

        return fee;
    }

    static getTimeDifference(timeIn, timeOut) {
        return Math.ceil(Math.abs((new Date(timeOut) - new Date(timeIn)) / (1000 * 60 * 60)));
    }
}

export default ParkingFeeCalculator;