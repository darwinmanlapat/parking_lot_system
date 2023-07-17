import { Size } from "../enums/Size";

export function getParkingSlotSize(rowIndex, columnIndex, parkingSlotSizes) {
    const { [Size.SMALL]: small, [Size.MEDIUM]: medium, [Size.LARGE]: large } = parkingSlotSizes;

    const previousSize = small.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
        ? Size.SMALL
        : medium.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
            ? Size.MEDIUM
            : Size.LARGE;

    return previousSize;
}
