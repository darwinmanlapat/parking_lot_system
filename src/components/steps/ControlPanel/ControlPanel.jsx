import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ControlPanel.scss";
import ParkingLot from "../../../lib/ParkingLot";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import { Size } from "../../../enums/Size";
import { getParkingSlotSize } from "../../../helpers/getParkingSlotSize";

const getTimeDifference = (timeIn, timeOut) => {
    return Math.ceil((new Date(timeOut) - new Date(timeIn)) / (1000 * 60 * 60))
}

const BASE_RATE = 40;

const HOURLY_RATE = {
    [Size.SMALL]: 20,
    [Size.MEDIUM]: 60,
    [Size.LARGE]: 100,
}

const DAILY_RATE = 5000;

const ControlPanel = (props) => {
    const {
        isLoading,
        isLastStep,
        isFirstStep,
        activeStep,
        stepCount,
        previousStep,
        nextStep,
        goToStep,
        handleStep,
    } = useWizard();

    const defaultVehicle = {
        license: '',
        size: 'S',
        time_in: '',
        time_out: '',
        coordinates: {}
    };

    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [unparkedVehicles, setUnparkedVehicles] = useState([]);

    useEffect(() => console.log('selectedEntryPoint', selectedEntryPoint), [selectedEntryPoint]);

    useEffect(() => console.log('currentVehicle', currentVehicle), [currentVehicle]);

    useEffect(() => console.log('vehicles', vehicles), [vehicles]);

    useEffect(() => console.log('unparkedVehicles', unparkedVehicles), [unparkedVehicles]);

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

    const parkVehicle = () => {
        const returningVehicleIndex = unparkedVehicles.findIndex((unParkedVehicle) => {
            return unParkedVehicle.license === currentVehicle.license && getTimeDifference(currentVehicle.time_in, unParkedVehicle.time_out) <= 1;
        });

        console.log('returningVehicle', returningVehicleIndex >= 0 ? unparkedVehicles[returningVehicleIndex] : null);

        const parkingSlotCoordinates = possibleParkingSlots();

        const availableSlot = findClosestAvailableSlot(selectedEntryPoint, parkingSlotCoordinates);

        if (availableSlot) {
            const adjustedVehicle = currentVehicle;

            // Replace the returning vehicle's time in with its previous time in to simulate the continuous rate
            if (returningVehicleIndex >= 0) {
                adjustedVehicle.time_in = unparkedVehicles[returningVehicleIndex].time_in;

                const adjustedUnparkedVehicles = [...unparkedVehicles];

                adjustedUnparkedVehicles.splice(returningVehicleIndex, 1);
                
                setUnparkedVehicles(...adjustedUnparkedVehicles);
            }

            setVehicles([...vehicles, { ...adjustedVehicle, coordinates: availableSlot }]);
            alert(`Vehicle with license plate ${currentVehicle.license} parked at coordinates (${availableSlot.rowIndex}, ${availableSlot.columnIndex})`);
        } else {
            alert('No available parking slots for the vehicle type.');
        }

        setCurrentVehicle(null);
        setSelectedEntryPoint(null);
    }

    const unParkVehicle = (parkedVehicle) => {
        const parkedVehicleIndex = vehicles.findIndex(
            vehicle => parkedVehicle.coordinates.rowIndex === vehicle.rowIndex && parkedVehicle.coordinates.columnIndex === vehicle.columnIndex
        );

        const parkedVehicleSlotSize = getParkingSlotSize(parkedVehicle.coordinates.rowIndex, parkedVehicle.coordinates.columnIndex, props.parkingSlotSizes);

        alert(calculateFee(parkedVehicle, parkedVehicleSlotSize));

        const adjustedVehicles = [...vehicles];

        adjustedVehicles.splice(parkedVehicleIndex, 1);

        setUnparkedVehicles(prevUnparkedVehicles => [...prevUnparkedVehicles, parkedVehicle]);
        setCurrentVehicle(null);
        setVehicles([...adjustedVehicles]);
    }

    const calculateFee = (unParkedVehicle, slotType) => {
        const { time_in, time_out } = unParkedVehicle;
        const timeDiff = getTimeDifference(time_in, time_out); // hours rounded up
        const full24Hour = Math.floor(timeDiff / 24);
        const remainderHours = timeDiff % 24;
        const full24HoursFee = full24Hour * DAILY_RATE;

        let exceedingHoursFee = Math.max(timeDiff - 3, 0) * HOURLY_RATE[slotType];

        // We compute the exceeding differently for 24-hour+ parking vs below 24-hour parking
        if (full24Hour > 0) {
            exceedingHoursFee = remainderHours * HOURLY_RATE[slotType];
        }

        let fee = exceedingHoursFee + full24HoursFee;

        // Only add the base rate for parking durations of less than 24 hours
        if (timeDiff < 24 && timeDiff > 0) {
            fee += BASE_RATE;
        }

        return fee;
    }

    const findClosestAvailableSlot = (entryPoint, parkingSlotCoordinates) => {
        let closestSlot = null;
        let minDistance = Infinity;

        for (const coordinates of parkingSlotCoordinates) {
            const distance = calculateDistance(entryPoint, coordinates);
            if (distance < minDistance && !isSlotOccupied(coordinates)) {
                minDistance = distance;
                closestSlot = coordinates;
            }
        }

        return closestSlot;
    };

    const isSlotOccupied = (coordinates) => {
        return vehicles.some((vehicle) => vehicle.coordinates.rowIndex === coordinates.rowIndex && vehicle.coordinates.columnIndex === coordinates.columnIndex);
    };

    const possibleParkingSlots = () => {
        const smallSlots = props.parkingSlotSizes[Size.SMALL];
        const mediumSlots = props.parkingSlotSizes[Size.MEDIUM];
        const largeSlots = props.parkingSlotSizes[Size.LARGE];

        if (currentVehicle.size === Size.SMALL) {
            return smallSlots.concat(mediumSlots, largeSlots);
        }

        if (currentVehicle.size === Size.MEDIUM) {
            return mediumSlots.concat(largeSlots);
        }

        if (currentVehicle.size === Size.LARGE) {
            return largeSlots;
        }
    };

    const calculateDistance = (point1, point2) => {
        const dx = Math.abs(point1.rowIndex - point2.rowIndex);
        const dy = Math.abs(point1.columnIndex - point2.columnIndex);
        return Math.max(dx, dy);
    };

    return (
        <div className="control-panel">
            <div className="row">
                <h2>Control Panel</h2>

                <div className="col-8">
                    <ParkingMap config={props.parkingMapConfig} step={activeStep} handleCellClick={handleCellClick} entryPoints={props.entryPoints} parkingSlotSizes={props.parkingSlotSizes} vehicles={vehicles} />
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
                                    <input id="time-in" type="datetime-local" value={currentVehicle.time_in} onChange={(e) => {
                                        setCurrentVehicle(prevVehicle => {
                                            return {
                                                ...prevVehicle,
                                                time_in: e.target.value,
                                            }
                                        });
                                    }} />
                                </div>
                                {
                                    Object.keys(currentVehicle.coordinates).length !== 0 ?
                                        <div>
                                            <label htmlFor="time-out">Time out</label>
                                            <input id="time-out" type="datetime-local" value={currentVehicle.time_out} onChange={(e) => {
                                                setCurrentVehicle(prevVehicle => {
                                                    return {
                                                        ...prevVehicle,
                                                        time_out: e.target.value,
                                                    }
                                                });
                                            }} />
                                        </div> : null
                                }

                                {
                                    Object.keys(currentVehicle.coordinates).length !== 0 ?
                                        <button onClick={() => unParkVehicle(currentVehicle)}>Unpark Vehicle</button> : <button onClick={() => parkVehicle()}>Park Vehicle</button>
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