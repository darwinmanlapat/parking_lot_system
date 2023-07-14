import React, { useEffect, useState } from 'react';
import { Wizard } from 'react-use-wizard';
import TableConstructor from './components/table-constructor/table-constructor';
import SetEntryPoints from './components/set-entry-points/set-entry-points';

// Vehicle class
class Vehicle {
  constructor(licensePlateNumber, vehicleType) {
    this.licensePlateNumber = licensePlateNumber;
    this.vehicleType = vehicleType;
  }
}

// ParkingSlot class
class ParkingSlot {
  constructor(slotNumber, slotType) {
    this.slotNumber = slotNumber;
    this.slotType = slotType;
    this.isOccupied = false;
    this.vehicle = null;
  }

  allocate(vehicle) {
    this.isOccupied = true;
    this.vehicle = vehicle;
  }

  free() {
    this.isOccupied = false;
    this.vehicle = null;
  }
}

// ParkingLot class
class ParkingLot {
  constructor(entryPoints, parkingSlots, vehicleMap) {
    this.entryPoints = entryPoints;
    this.parkingSlots = parkingSlots;
    this.vehicleMap = vehicleMap;
  }

  parkVehicle(vehicle) {
    const entryPointDistances = this.parkingSlots.map(slot => slot.slotNumber);
    const closestEntryPoint = entryPointDistances.indexOf(Math.min(...entryPointDistances));
    const availableSlots = this.parkingSlots.filter(slot => !slot.isOccupied && slot.slotType.includes(this.vehicleMap[vehicle.vehicleType]));

    if (availableSlots.length === 0) {
      console.log("No available slots for parking.");
      return;
    }

    const closestSlot = availableSlots.reduce((closest, slot) => {
      const slotDistance = Math.abs(slot.slotNumber - closestEntryPoint);
      return slotDistance < Math.abs(closest.slotNumber - closestEntryPoint) ? slot : closest;
    });

    closestSlot.allocate(vehicle);
    console.log(`Vehicle ${vehicle.licensePlateNumber} parked at Slot ${closestSlot.slotNumber}`);
  }

  unparkVehicle(vehicle) {
    const slot = this.parkingSlots.find(slot => slot.isOccupied && slot.vehicle === vehicle);
    if (!slot) {
      console.log("Vehicle is not parked in the parking lot.");
      return;
    }

    const entryTime = slot.vehicle.entryTime;
    const exitTime = new Date();
    const fee = this.calculateFee(entryTime, exitTime, vehicle.vehicleType, slot.slotType);

    slot.free();
    console.log(`Vehicle ${vehicle.licensePlateNumber} has been unparked. Fee: ${fee} pesos.`);

    return fee;
  }

  calculateFee(entryTime, exitTime, vehicleType, slotType) {
    const timeDiff = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60)); // hours rounded up
    const baseRate = 40;

    let exceedingHourlyRate = 0;
    if (slotType === "SP") exceedingHourlyRate = 20;
    else if (slotType === "MP") exceedingHourlyRate = 60;
    else if (slotType === "LP") exceedingHourlyRate = 100;

    const exceedingHoursFee = Math.max(timeDiff - 3, 0) * exceedingHourlyRate;
    const full24HoursFee = Math.floor(timeDiff / 24) * 5000;
    const remainderHoursFee = (timeDiff % 24) * exceedingHourlyRate;

    const fee = baseRate + exceedingHoursFee + full24HoursFee + remainderHoursFee;

    return fee;
  }
}

function App() {
  const [numEntryPoints, setNumEntryPoints] = useState(3);
  const [numRows, setNumRows] = useState(1);
  const [numColumns, setNumColumns] = useState(1);
  const [parkingMap, setParkingMap] = useState(Array.from({ length: numRows }, () => Array(numColumns).fill(null)));
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [parkedVehicle, setParkedVehicle] = useState(null);
  const [unparkedVehicle, setUnparkedVehicle] = useState(null);

  const handleParkVehicle = () => {
    const entryPoints = Array.from({ length: numEntryPoints }, (_, i) => `Entry ${String.fromCharCode(65 + i)}`);
    const parkingSlots = [];

    parkingMap.forEach((row, rowIndex) => {
      row.forEach((slotType, columnIndex) => {
        const slotNumber = `${String.fromCharCode(65 + rowIndex)}${columnIndex + 1}`;
        parkingSlots.push(new ParkingSlot(slotNumber, slotType));
      });
    });

    const vehicleMap = {
      S: 0, // Small vehicle
      M: 1, // Medium vehicle
      L: 2, // Large vehicle
    };

    const parkingLot = new ParkingLot(entryPoints, parkingSlots, vehicleMap);
    const vehicle = new Vehicle(vehiclePlateNumber, vehicleType);
    parkingLot.parkVehicle(vehicle);
    setParkedVehicle(vehicle);
    setVehiclePlateNumber('');
    setVehicleType('');
  };

  const handleUnparkVehicle = () => {
    const entryPoints = Array.from({ length: numEntryPoints }, (_, i) => `Entry ${String.fromCharCode(65 + i)}`);
    const parkingSlots = [];

    parkingMap.forEach((row, rowIndex) => {
      row.forEach((slotType, columnIndex) => {
        const slotNumber = `${String.fromCharCode(65 + rowIndex)}${columnIndex + 1}`;
        parkingSlots.push(new ParkingSlot(slotNumber, slotType));
      });
    });

    const vehicleMap = {
      S: 0, // Small vehicle
      M: 1, // Medium vehicle
      L: 2, // Large vehicle
    };

    const parkingLot = new ParkingLot(entryPoints, parkingSlots, vehicleMap);
    parkingLot.unparkVehicle(parkedVehicle);
    setUnparkedVehicle(parkedVehicle);
    setParkedVehicle(null);
  };

  const handleSlotTypeChange = (rowIndex, columnIndex, slotType) => {
    const updatedParkingMap = [...parkingMap];
    updatedParkingMap[rowIndex][columnIndex] = slotType;
    setParkingMap(updatedParkingMap);
  };

  useEffect(() => {
    console.log(numRows, numColumns);
    setParkingMap(Array.from({ length: numRows }, () => Array(numColumns).fill(null)));
  }, [numRows, numColumns])

  // const handleNumRowsChange = (strRowValue) => {
  //   setNumRows(parseInt(strRowValue));
  // }

  // const handleNumColumnsChange = (strColValue) => {
  //   setNumColumns(parseInt(strColValue));
  // }

  return (
    <div>
      {/* <h2>Parking Lot System</h2>

      <div>
        <label>
          Number of Entry Points:
          <input
            type="number"
            min="3"
            value={numEntryPoints}
            onChange={e => setNumEntryPoints(parseInt(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Number of Rows:
          <input
            type="number"
            min="1"
            value={numRows}
            onChange={e => handleNumRowsChange(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Number of Columns:
          <input
            type="number"
            min="1"
            value={numColumns}
            onChange={e => handleNumColumnsChange(e.target.value)}
          />
        </label>
      </div>

      <div>
        <h3>Parking Slot Configuration</h3>
        <table>
          <tbody>
            {parkingMap.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((slotType, columnIndex) => (
                  <td key={columnIndex}>
                    <input
                      type="text"
                      value={slotType || ''}
                      onChange={e => handleSlotTypeChange(rowIndex, columnIndex, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>Park a Vehicle</h3>
        <label>
          License Plate Number:
          <input
            type="text"
            value={vehiclePlateNumber}
            onChange={e => setVehiclePlateNumber(e.target.value)}
          />
        </label>
        <br />
        <label>
          Vehicle Type:
          <select
            value={vehicleType}
            onChange={e => setVehicleType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </label>
        <br />
        <button onClick={handleParkVehicle}>Park Vehicle</button>
      </div>

      {parkedVehicle && (
        <div>
          <h3>Parked Vehicle</h3>
          <p>License Plate Number: {parkedVehicle.licensePlateNumber}</p>
          <p>Vehicle Type: {parkedVehicle.vehicleType}</p>
          <button onClick={handleUnparkVehicle}>Unpark Vehicle</button>
        </div>
      )}

      {unparkedVehicle && (
        <div>
          <h3>Unparked Vehicle</h3>
          <p>License Plate Number: {unparkedVehicle.licensePlateNumber}</p>
          <p>Vehicle Type: {unparkedVehicle.vehicleType}</p>
        </div>
      )} */}

      <Wizard>
        <TableConstructor setNumEntryPoints={setNumEntryPoints} setNumRows={setNumRows} setNumColumns={setNumColumns} />
        <SetEntryPoints parkingMap={parkingMap} numEntryPoints={numEntryPoints} />
      </Wizard>
    </div>
  );
}

export default App;