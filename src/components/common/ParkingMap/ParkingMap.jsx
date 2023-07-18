import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ParkingMap.scss";
import { Size } from "../../../enums/Size";
import { getParkingSlotSize } from "../../../helpers/getParkingSlotSize";

const ParkingMap = (props) => {
    const handleCellClick = (rowIndex, columnIndex) => {
        if (props.handleCellClick) {
            props.handleCellClick(rowIndex, columnIndex);
        }
    }

    const renderCell = (rowIndex, columnIndex) => {
        if (props.step === 2) {
            return (
                <select onChange={e => props.handleParkingSlotSizeChange(rowIndex, columnIndex, e.target.value)}>
                    <option>{Size.SMALL}</option>
                    <option>{Size.MEDIUM}</option>
                    <option>{Size.LARGE}</option>
                </select>
            );
        }

        if (props.step === 3) {
            let vehicle = null;

            if (props.vehicles.length !== 0) {
                vehicle = props.vehicles.filter(vehicle => vehicle.coordinates.rowIndex === rowIndex && vehicle.coordinates.columnIndex === columnIndex)[0];
            }

            if (!!vehicle) {
                return vehicle.license;
            }

            return getParkingSlotSize(rowIndex, columnIndex, props.parkingSlotSizes);
        }
    }

    return (
        <div className="parking-map">
            <table border={1} width={100}>
                <tbody>
                    {/* {props.parkingMap.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((column, columnIndex) => {
                                const isEntryPoint = props.entryPoints.some(
                                    entryPoint => entryPoint.rowIndex === rowIndex && entryPoint.columnIndex === columnIndex
                                );
                                // const isEntryPoint = column === 'E';

                                return (
                                    <td
                                        key={columnIndex}
                                        className={isEntryPoint ? 'clicked' : ''}
                                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                                    >
                                        {
                                            // Show the parking slot size options if we are in step 2 and the current cell is not an entry point
                                            !isEntryPoint ? renderCell(rowIndex, columnIndex, column) : null
                                        }
                                    </td>
                                );
                            })}
                        </tr>
                    ))} */}

                    {Array.from({ length: props.config.tableSize }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: props.config.tableSize }, (_, columnIndex) => {
                                const isEntryPoint = props.entryPoints.some(
                                    entryPoint => entryPoint.rowIndex === rowIndex && entryPoint.columnIndex === columnIndex
                                );

                                return (
                                    <td
                                        key={columnIndex}
                                        className={isEntryPoint && props.step !== 0 ? 'clicked' : ''}
                                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                                    >
                                        {!isEntryPoint ? renderCell(rowIndex, columnIndex) : null}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ParkingMap;