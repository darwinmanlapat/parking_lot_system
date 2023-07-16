import { SizeEnum } from "../enums/Sizes";

export function getParkingSlotSize(rowIndex, columnIndex, parkingSlotSizes) {
    const { [SizeEnum.SMALL]: small, [SizeEnum.MEDIUM]: medium, [SizeEnum.LARGE]: large } = parkingSlotSizes;

    const previousSize = small.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
        ? SizeEnum.SMALL
        : medium.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
            ? SizeEnum.MEDIUM
            : SizeEnum.LARGE;

    return previousSize;
}
