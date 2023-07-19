import { useEffect, useState } from "react";
import "./ControlPanel.scss";
import { useWizard } from "react-use-wizard";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import ParkingLot from "../../../lib/ParkingLot";
import VehicleManager from "../../../lib/VehicleManager";

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
    const [vehicleManager, setVehicleManager] = useState(null);
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
        setVehicleManager(new VehicleManager(vehicles, unparkedVehicles));
    }, [props.parkingSlotSizes, vehicles, unparkedVehicles]);

    const handleCellClick = (rowIndex, columnIndex) => {
        const isEntryPointCell = ParkingLot.isEntryPoint(props.entryPoints, rowIndex, columnIndex);
        const parkedVehicle = vehicleManager.getVehicleByPosition(rowIndex, columnIndex);

        if (isEntryPointCell) {
            setSelectedEntryPoint({ rowIndex, columnIndex });
            setCurrentVehicle(defaultVehicle);
        } else if (!!parkedVehicle) {
            setCurrentVehicle(parkedVehicle);
        } else {
            setCurrentVehicle(null);
            setSelectedEntryPoint(null);
        }
    }

    const handleParkButton = () => {
        const parkedVehicleCoordinates = parkingLot?.parkVehicle(selectedEntryPoint, currentVehicle.size);

        if (!!parkedVehicleCoordinates) {
            const isReturningVehicle = vehicleManager?.isReturningVehicle(currentVehicle);
            let vehicleTimeIn = currentVehicle.timeIn;

            // Replace the returning vehicle's time in with its previous time in to simulate the continuous rate
            if (isReturningVehicle) {
                const returningVehicle = vehicleManager.getReturningVehicle(currentVehicle);

                vehicleTimeIn = returningVehicle.timeIn;

                setUnparkedVehicles(unparkedVehicles.filter(unparkedVehicle =>
                    !(unparkedVehicle.coordinates.rowIndex === returningVehicle.coordinates.rowIndex &&
                        unparkedVehicle.coordinates.columnIndex === returningVehicle.coordinates.columnIndex)
                ));
            }

            alert(`Vehicle with license plate ${currentVehicle.license} parked at coordinates (${parkedVehicleCoordinates.rowIndex}, ${parkedVehicleCoordinates.columnIndex})`);

            setVehicles([...vehicles, { ...currentVehicle, coordinates: parkedVehicleCoordinates, timeIn: vehicleTimeIn }]);
        } else {
            alert('No available parking slots for the vehicle type.');
        }

        setCurrentVehicle(null);
        setSelectedEntryPoint(null);
    }

    const handleUnparkButton = (parkedVehicle) => {
        const parkingFee = parkingLot?.unparkVehicle(parkedVehicle);

        // TODO: Add this to the screen instead of using an alert
        alert(parkingFee);

        setCurrentVehicle(null);
        setUnparkedVehicles(prevUnparkedVehicles => [...prevUnparkedVehicles, parkedVehicle]);
        setVehicles(vehicles.filter(vehicle =>
            !(vehicle.coordinates.rowIndex === parkedVehicle.coordinates.rowIndex &&
                vehicle.coordinates.columnIndex === parkedVehicle.coordinates.columnIndex)
        ));
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