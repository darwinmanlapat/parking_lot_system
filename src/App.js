import React, { useEffect, useState } from 'react';
import { Wizard } from 'react-use-wizard';
import TableConstructor from './components/steps/TableConstructor/TableConstructor';
import SetEntryPoints from './components/steps/SetEntryPoints/SetEntryPoints';
import SetParkingSlotSizes from './components/steps/SetParkingSlotSizes/SetParkingSlotSizes';
import ParkingMap from './components/common/ParkingMap/ParkingMap';
import ControlPanel from './components/steps/ControlPanel/ControlPanel';
import ParkingLot from './lib/ParkingLot';
import { SizeEnum } from './enums/Sizes';

function App() {
  const [activeStep, setActiveStep] = useState(1);
  // const [numEntryPoints, setNumEntryPoints] = useState(3);
  // const [numRows, setNumRows] = useState(numEntryPoints);
  // const [numColumns, setNumColumns] = useState(numEntryPoints);
  const [entryPoints, setEntryPoints] = useState([]);
  const [parkingMapConfig, setParkingMapConfig] = useState({
    numEntryPoints: 3,
    numRows: 3,
    numColumns: 3,
  });
  const [parkingSlotSizes, setParkingSlotSizes] = useState({
    [SizeEnum.SMALL]: [],
    [SizeEnum.MEDIUM]: [],
    [SizeEnum.LARGE]: []
  });
  // const [parkingLot, setParkingLot] = useState(null);
  // const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  // const [vehicleType, setVehicleType] = useState('');
  // const [parkedVehicle, setParkedVehicle] = useState(null);
  // const [unparkedVehicle, setUnparkedVehicle] = useState(null);

  // const handleParkVehicle = () => {
  //   const entryPoints = Array.from({ length: numEntryPoints }, (_, i) => `Entry ${String.fromCharCode(65 + i)}`);
  //   const parkingSlots = [];

  //   parkingMap.forEach((row, rowIndex) => {
  //     row.forEach((slotType, columnIndex) => {
  //       const slotNumber = `${String.fromCharCode(65 + rowIndex)}${columnIndex + 1}`;
  //       parkingSlots.push(new ParkingSlot(slotNumber, slotType));
  //     });
  //   });

  //   const vehicleMap = {
  //     S: 0, // Small vehicle
  //     M: 1, // Medium vehicle
  //     L: 2, // Large vehicle
  //   };

  // const parkingLot = new ParkingLot(entryPoints, parkingMap);

  // console.log(parkingLot);
  //   const vehicle = new Vehicle(vehiclePlateNumber, vehicleType);
  //   parkingLot.parkVehicle(vehicle);
  //   setParkedVehicle(vehicle);
  //   setVehiclePlateNumber('');
  //   setVehicleType('');
  // };

  // const handleUnparkVehicle = () => {
  //   const entryPoints = Array.from({ length: numEntryPoints }, (_, i) => `Entry ${String.fromCharCode(65 + i)}`);
  //   const parkingSlots = [];

  //   parkingMap.forEach((row, rowIndex) => {
  //     row.forEach((slotType, columnIndex) => {
  //       const slotNumber = `${String.fromCharCode(65 + rowIndex)}${columnIndex + 1}`;
  //       parkingSlots.push(new ParkingSlot(slotNumber, slotType));
  //     });
  //   });

  //   const vehicleMap = {
  //     S: 0, // Small vehicle
  //     M: 1, // Medium vehicle
  //     L: 2, // Large vehicle
  //   };

  //   const parkingLot = new ParkingLot(entryPoints, parkingSlots, vehicleMap);
  //   parkingLot.unparkVehicle(parkedVehicle);
  //   setUnparkedVehicle(parkedVehicle);
  //   setParkedVehicle(null);
  // };

  // const handleSlotTypeChange = (rowIndex, columnIndex, slotType) => {
  //   const updatedParkingMap = [...parkingMap];
  //   updatedParkingMap[rowIndex][columnIndex] = slotType;
  //   setParkingMap(updatedParkingMap);
  // };

  // Update the parking map whenever the number of rows and column changes
  useEffect(() => {
    setEntryPoints([]);
    // setParkingMap(Array.from({ length: numRows }, () => Array(numColumns).fill(null)));
  }, [parkingMapConfig.numRows, parkingMapConfig.numColumns]);

  useEffect(() => {
    console.log('parkingMapConfig', parkingMapConfig);
  }, [parkingMapConfig]);

  useEffect(() => {
    console.log('parkingSlotSizes', parkingSlotSizes);
  }, [parkingSlotSizes]);

  useEffect(() => {
    // if (parkingMap.length !== 0) {
    //   const updatedParkingMap = [...parkingMap];
    //   const smallSlots = [];

    //   updatedParkingMap.map((row, rowIndex) => {
    //     row.map((column, columnIndex) => {
    //       const isEntryPoint = entryPoints.some(
    //         entryPoint => entryPoint.rowIndex === rowIndex && entryPoint.columnIndex === columnIndex
    //       );

    //       if (isEntryPoint) {
    //         updatedParkingMap[rowIndex][columnIndex] = 'E';

    //         // Remove the small slot from the array
    //         smallSlots.filter(
    //           smallSlot => smallSlot.rowIndex !== rowIndex && smallSlot.columnIndex !== columnIndex
    //         );
    //       } else {
    //         updatedParkingMap[rowIndex][columnIndex] = SizeEnum.SMALL;

    //         // Add the slot to the small slots array
    //         smallSlots.push({ rowIndex, columnIndex });
    //       }
    //     });
    //   });

    //   setParkingMap(updatedParkingMap);
    //   setParkingSlotSizes(prevParkingSlotSizes => {
    //     return {
    //       [SizeEnum.SMALL]: smallSlots,
    //       [SizeEnum.MEDIUM]: [],
    //       [SizeEnum.LARGE]: [],
    //     };
    //   });
    // }

    const smallSlots = [];

    for (let rowIndex = 0; rowIndex < parkingMapConfig.numRows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < parkingMapConfig.numColumns; columnIndex++) {
        const isEntryPoint = entryPoints.some(
          entryPoint => entryPoint.rowIndex === rowIndex && entryPoint.columnIndex === columnIndex
        );

        if (isEntryPoint) {
          // Remove the small slot from the array
          smallSlots.filter(
            smallSlot => smallSlot.rowIndex !== rowIndex && smallSlot.columnIndex !== columnIndex
          );
        } else {
          // Add the slot to the small slots array
          smallSlots.push({ rowIndex, columnIndex });
        }
      }
    }

    setParkingSlotSizes({
      [SizeEnum.SMALL]: smallSlots,
      [SizeEnum.MEDIUM]: [],
      [SizeEnum.LARGE]: [],
    });
  }, [entryPoints]);

  // const updateParkingMap = (givenRowIndex, givenColumnIndex, cellValue) => {
  //   const updatedParkingMap = [...parkingMap];

  //   updatedParkingMap.map((row, rowIndex) => {
  //     row.map((column, columnIndex) => {
  //       if (rowIndex === givenRowIndex && columnIndex === givenColumnIndex) {
  //         updatedParkingMap[rowIndex][columnIndex] = cellValue;
  //       } else {
  //         updatedParkingMap[rowIndex][columnIndex] = column;
  //       }
  //     });
  //   });

  //   setParkingMap(updatedParkingMap);
  // }

  return (
    <div className="app">
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
        <TableConstructor parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} />
        <SetEntryPoints parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} setEntryPoints={setEntryPoints} />
        <SetParkingSlotSizes parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} parkingSlotSizes={parkingSlotSizes} setParkingSlotSizes={setParkingSlotSizes} />
        <ControlPanel parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} parkingSlotSizes={parkingSlotSizes} />
      </Wizard>

      {/* <ParkingMap parkingMap={parkingMap} step={activeStep} handleCellClick={handleCellClick} handleParkingSlotSizeChange={updateParkingMap} /> */}
    </div>
  );
}

export default App;