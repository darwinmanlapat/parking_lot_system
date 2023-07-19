import "./ParkingMap.scss";
import { Size } from "../../../enums/Size";
import ParkingLot from "../../../lib/ParkingLot";
import VehicleManager from "../../../lib/VehicleManager";
import { useEffect, useState } from "react";

const ParkingMap = (props) => {
    const [ vehicleManager, setVehicleManager ] = useState(null);

    useEffect(() => setVehicleManager(new VehicleManager(props.vehicles)), [props.vehicles]);

    useEffect(() => console.log(vehicleManager), [vehicleManager]);

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
            const vehicle = vehicleManager?.getVehicleByPosition(rowIndex, columnIndex);

            if (!!vehicle) {
                return vehicle.license;
            }

            return ParkingLot.getParkingSlotSize(rowIndex, columnIndex, props.parkingSlotSizes);
        }
    }

    return (
        <div className="parking-map"><center>
            <table className="table table-bordered border-primary">
                <tbody>
                    {
                        Array.from({ length: props.config.tableSize }, (row, rowIndex) => (
                            <tr key={'parking-map-row' + rowIndex}>
                                {
                                    Array.from({ length: props.config.tableSize }, (column, columnIndex) => {
                                        const isEntryPoint = ParkingLot.isEntryPoint(props.entryPoints, rowIndex, columnIndex);

                                        return (
                                            <td
                                                key={'parking-map-column' + columnIndex}
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
            </table></center>
        </div>
    );
}

export default ParkingMap;