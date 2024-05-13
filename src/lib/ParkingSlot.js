import { Sizes } from "../enums/Size";
import { findKey, isEqual } from "lodash";

class ParkingSlot {

    constructor(sizes) {
        this._sizes = sizes;
    }

    getSizeByCoordinates(rowIndex, columnIndex) {
        return findKey(this._sizes, slots => slots.some((slot) => isEqual(slot, { rowIndex, columnIndex })));
    }

    getPossibleSlots(size) {
        const smallSlots = this._sizes[Sizes.SMALL];
        const mediumSlots = this._sizes[Sizes.MEDIUM];
        const largeSlots = this._sizes[Sizes.LARGE];

        if (size === Sizes.SMALL) {
            return smallSlots.concat(mediumSlots, largeSlots);
        }

        if (size === Sizes.MEDIUM) {
            return mediumSlots.concat(largeSlots);
        }

        if (size === Sizes.LARGE) {
            return largeSlots;
        }
    }

    updateSizes(rowIndex, columnIndex, size) {
        const previousSize = this.getSizeByCoordinates(rowIndex, columnIndex);

        this._sizes[previousSize] = this._sizes[previousSize].filter(coord =>
            coord.rowIndex !== rowIndex || coord.columnIndex !== columnIndex
        );

        this._sizes[size] = [...this._sizes[size], { rowIndex, columnIndex }];

        return this._sizes;
    }
}

export default ParkingSlot;
