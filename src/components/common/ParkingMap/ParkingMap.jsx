import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ParkingMap.scss";

const ParkingMap = (props) => {
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
                                        onClick={() => props.handleCellClick(rowIndex, columnIndex)}
                                    >
                                        {
                                            props.step === 2 && !isEntryPoint ? (
                                                <select>
                                                    <option>S</option>
                                                    <option>M</option>
                                                    <option>L</option>
                                                </select>
                                            ) : null
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