import { useEffect, useState } from "react";
import "./ParkingMap.scss";
import { Size } from "../../../enums/Size";
import ParkingLot from "../../../lib/ParkingLot";
import VehicleManager from "../../../lib/VehicleManager";
import ParkingSlot from "../../../lib/ParkingSlot";
import config from "../../../config";
import { isNil } from "lodash";

const ParkingMap = (props) => {
    const [parkingSlot, setParkingSLot] = useState(null);
    const [vehicleManager, setVehicleManager] = useState(null);

    useEffect(() => setParkingSLot(new ParkingSlot(props.parkingSlotSizes)), [props.parkingSlotSizes]);
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
                <select className="size-select" onChange={e => props.handleParkingSlotSizeChange(rowIndex, columnIndex, e.target.value)}>
                    <option>{Size.SMALL}</option>
                    <option>{Size.MEDIUM}</option>
                    <option>{Size.LARGE}</option>
                </select>
            );
        }

        if (props.step === 3) {
            const vehicle = vehicleManager?.getVehicleByPosition(rowIndex, columnIndex);

            if (!isNil(vehicle)) {
                return (<div className="parked-vehicle">{vehicle.license}</div>);
            }

            return parkingSlot?.getSizeByCoordinates(rowIndex, columnIndex);
        }
    }

    return (
        <div className="parking-map"><center>
            <table className="table table-bordered border-primary">
                <tbody>
                    {
                        props.config.tableSize >= config.MIN_ENTRY_POINTS && props.config.tableSize <= config.MAX_TABLE_SIZE ?
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
                            )) : null
                    }
                </tbody>
            </table></center>
        </div>
    );
}

export default ParkingMap;