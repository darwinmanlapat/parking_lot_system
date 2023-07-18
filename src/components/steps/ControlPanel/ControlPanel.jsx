import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import ParkingLot from "../../../lib/ParkingLot";
import "./ControlPanel.scss";

const ControlPanel = (props) => {
    const {
        activeStep,
        previousStep,
    } = useWizard();

    const defaultVehicle = {
        license: '',
        size: 'S',
        timeIn: '',
        timeOut: '',
        coordinates: {}
    };
    
    const [parkingLot, setParkingLot] = useState(null);
    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [unparkedVehicles, setUnparkedVehicles] = useState([]);

    useEffect(() => console.log('selectedEntryPoint', selectedEntryPoint), [selectedEntryPoint]);

    useEffect(() => console.log('currentVehicle', currentVehicle), [currentVehicle]);

    useEffect(() => console.log('vehicles', vehicles), [vehicles]);

    useEffect(() => console.log('unparkedVehicles', unparkedVehicles), [unparkedVehicles]);

    useEffect(() => {
        setParkingLot(new ParkingLot(props.parkingSlotSizes, vehicles, unparkedVehicles));
    }, [props.parkingSlotSizes, vehicles, unparkedVehicles]);

    const handleCellClick = (rowIndex, columnIndex) => {
        const isEntryPointCell = props.entryPoints.some(
            entryPointCell => entryPointCell.rowIndex === rowIndex && entryPointCell.columnIndex === columnIndex
        );
        const parkedVehicleIndex = vehicles.findIndex(
            vehicle => vehicle.coordinates.rowIndex === rowIndex && vehicle.coordinates.columnIndex === columnIndex
        );

        if (isEntryPointCell) {
            setSelectedEntryPoint({ rowIndex, columnIndex });
            setCurrentVehicle(defaultVehicle);
        } else if (parkedVehicleIndex >= 0) {
            setCurrentVehicle(vehicles[parkedVehicleIndex]);
        } else {
            setCurrentVehicle(null);
            setSelectedEntryPoint(null);
        }
    }

    const handleParkButton = () => {
        const parkedVehicleCoordinates = parkingLot.parkVehicle(selectedEntryPoint, currentVehicle);

        if (!!parkedVehicleCoordinates) {
            alert(`Vehicle with license plate ${currentVehicle.license} parked at coordinates (${parkedVehicleCoordinates.rowIndex}, ${parkedVehicleCoordinates.columnIndex})`);

            setVehicles([...vehicles, { ...currentVehicle, coordinates: parkedVehicleCoordinates }]);
        } else {
            alert('No available parking slots for the vehicle type.');
        }

        setCurrentVehicle(null);
        setSelectedEntryPoint(null);
    }

    const handleUnparkButton = (parkedVehicle) => {
        const parkedVehicleIndex = vehicles.findIndex(
            vehicle => parkedVehicle.coordinates.rowIndex === vehicle.rowIndex && parkedVehicle.coordinates.columnIndex === vehicle.columnIndex
        );

        const parkingFee = parkingLot.unparkVehicle(parkedVehicle);

        alert(parkingFee);

        const adjustedVehicles = [...vehicles];

        adjustedVehicles.splice(parkedVehicleIndex, 1);

        setUnparkedVehicles(prevUnparkedVehicles => [...prevUnparkedVehicles, parkedVehicle]);
        setCurrentVehicle(null);
        setVehicles([...adjustedVehicles]);
    }

    return (
        <div className="control-panel">
            <div className="row">
                <h2>Control Panel</h2>

                <div className="col-8">
                    <ParkingMap
                        step={activeStep}
                        vehicles={vehicles}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                        parkingSlotSizes={props.parkingSlotSizes}
                        handleCellClick={handleCellClick}
                    />
                </div>

                <div className="col-4">
                    {
                        selectedEntryPoint || !!currentVehicle ?
                            <div className="park-vehicle">
                                <h3>Vehicle Details</h3>
                                {
                                    selectedEntryPoint ? <div>Entry Point: Row {selectedEntryPoint.rowIndex} Column {selectedEntryPoint.columnIndex}</div> : null
                                }
                                <div>
                                    <label htmlFor="license-plate">License Plate</label>
                                    <input type="text" id="license-plate" value={currentVehicle.license} onChange={(e) => {
                                        setCurrentVehicle(prevVehicle => {
                                            return {
                                                ...prevVehicle,
                                                license: e.target.value,
                                            }
                                        });
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="vehicle-size">Vehicle Size</label>
                                    <select id="vehicle-size" value={currentVehicle.size} onChange={(e) => {
                                        setCurrentVehicle(prevVehicle => {
                                            return {
                                                ...prevVehicle,
                                                size: e.target.value,
                                            }
                                        });
                                    }}>
                                        <option>S</option>
                                        <option>M</option>
                                        <option>L</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="time-in">Time in</label>
                                    <input id="time-in" type="datetime-local" value={currentVehicle.timeIn} onChange={(e) => {
                                        setCurrentVehicle(prevVehicle => {
                                            return {
                                                ...prevVehicle,
                                                timeIn: e.target.value,
                                            }
                                        });
                                    }} />
                                </div>
                                {
                                    Object.keys(currentVehicle.coordinates).length !== 0 ?
                                        <div>
                                            <label htmlFor="time-out">Time out</label>
                                            <input id="time-out" type="datetime-local" value={currentVehicle.timeOut} onChange={(e) => {
                                                setCurrentVehicle(prevVehicle => {
                                                    return {
                                                        ...prevVehicle,
                                                        timeOut: e.target.value,
                                                    }
                                                });
                                            }} />
                                        </div> : null
                                }

                                {
                                    Object.keys(currentVehicle.coordinates).length !== 0 ?
                                        <button onClick={() => handleUnparkButton(currentVehicle)}>Unpark Vehicle</button> : <button onClick={() => handleParkButton()}>Park Vehicle</button>
                                }
                            </div> : null
                    }

                    <div className="step-nav-buttons">
                        <button onClick={() => previousStep()}>Previous</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;