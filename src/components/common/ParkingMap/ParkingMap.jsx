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
        <div className="parking-map"><center>
            <table className="table table-bordered border-primary">
                <tbody>
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
            </table></center>
        </div>
    );
}

export default ParkingMap;