import { Size } from "./enums/Size";

const config = {
    "MIN_ENTRY_POINTS": 3,
    "MAX_TABLE_SIZE": 10,
    "BASE_RATE": 40,
    "BASE_HOUR": 3,
    "HOURLY_RATE": {
        [Size.SMALL]: 20,
        [Size.MEDIUM]: 60,
        [Size.LARGE]: 100,
    },
    "DAILY_RATE": 5000
}

export default config;