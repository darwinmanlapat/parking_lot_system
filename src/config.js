import { Sizes } from "./enums/Size";

const config = {
	MIN_ENTRY_POINTS: 3,
	MAX_TABLE_SIZE: 10,
	BASE_RATE: 40,
	BASE_HOUR: 3,
	HOURLY_RATE: {
		[Sizes.SMALL]: 20,
		[Sizes.MEDIUM]: 60,
		[Sizes.LARGE]: 100,
	},
	DAILY_RATE: 5000,
	TOAST_DURATION: 6000,
};
export default config;
