import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ParkingMap.scss";

const ParkingMap = (props) => {
    const handleCellClick = (rowIndex, columnIndex) => {
        if (props.handleCellClick) {
            props.handleCellClick(rowIndex, columnIndex);
        }
    }

    const renderCell = (rowIndex, columnIndex, cellValue) => {
        if (props.step === 2) {
            return (
                <select onChange={e => props.handleParkingSlotSizeChange(rowIndex, columnIndex, e.target.value)}>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                </select>
            );
        }
        
        if (props.step === 3) {
            return cellValue;
        }
    }

    return (
        <div className="parking-map">
            <table border={1} width={100}>
                <tbody>
                    {props.parkingMap.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((column, columnIndex) => {
                                // const isCellClicked = props.entryPoints.some(
                                //     entryPoint => entryPoint.rowIndex === rowIndex && entryPoint.columnIndex === columnIndex
                                // );
                                const isEntryPoint = column === 'E';

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
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ParkingMap;