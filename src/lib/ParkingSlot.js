import { Size } from "../enums/Size";

/**
 * A class representing parking slots and associated operations.
 */
class ParkingSlot {
    /**
     * Creates an instance of ParkingSlot.
     * 
     * @param {Object} sizes - An object containing parking slot sizes categorized by vehicle size (S, M, or L).
     */
    constructor(sizes) {
        this._sizes = sizes;
    }

    /**
     * Gets the size of a parking slot based on its coordinates.
     * 
     * @param {number} rowIndex - The row index of the parking slot.
     * @param {number} columnIndex - The column index of the parking slot.
     * 
     * @returns {string} The size of the parking slot (S, M, or L).
     */
    getSizeByCoordinates(rowIndex, columnIndex) {
        const { [Size.SMALL]: small, [Size.MEDIUM]: medium } = this._sizes;
        const isSmall = small.some(slot =>
            slot.rowIndex === rowIndex && slot.columnIndex === columnIndex
        );
        const isMedium = medium.some(slot =>
            slot.rowIndex === rowIndex && slot.columnIndex === columnIndex
        );

        if (isSmall) {
            return Size.SMALL;
        }

        if (isMedium) {
            return Size.MEDIUM;
        }

        return Size.LARGE;
    }

    /**
     * Gets an array of possible parking slots based on the vehicle size.
     * 
     * @param {string} size - The size of the vehicle (S, M, or L).
     * 
     * @returns {Array} An array of possible parking slot coordinates.
     */
    getPossibleSlots(size) {
        const smallSlots = this._sizes[Size.SMALL];
        const mediumSlots = this._sizes[Size.MEDIUM];
        const largeSlots = this._sizes[Size.LARGE];

        if (size === Size.SMALL) {
            return smallSlots.concat(mediumSlots, largeSlots);
        }

        if (size === Size.MEDIUM) {
            return mediumSlots.concat(largeSlots);
        }

        if (size === Size.LARGE) {
            return largeSlots;
        }
    }

    /**
     * Updates the sizes of parking slots based on the new size and coordinates.
     * 
     * @param {number} rowIndex - The row index of the parking slot.
     * @param {number} columnIndex - The column index of the parking slot.
     * @param {string} size - The new size of the parking slot (S, M, or L).
     * 
     * @returns {Object} An object containing the updated parking slot sizes.
     */
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
