import React, { useEffect, useState } from 'react';
import "./App.scss";
import { Wizard } from 'react-use-wizard';
import { Sizes } from './enums/Size';
import TableConstructor from './components/steps/TableConstructor/TableConstructor';
import SetEntryPoints from './components/steps/SetEntryPoints/SetEntryPoints';
import SetParkingSlotSizes from './components/steps/SetParkingSlotSizes/SetParkingSlotSizes';
import ControlPanel from './components/steps/ControlPanel/ControlPanel';
import ParkingLot from './lib/ParkingLot';
import config from './config';
import { isEqual } from 'lodash';

function App() {
  const [entryPoints, setEntryPoints] = useState([]);
  const [parkingMapConfig, setParkingMapConfig] = useState({
    numEntryPoints: config.MIN_ENTRY_POINTS,
    tableSize: config.MIN_ENTRY_POINTS,
  });
  const [parkingSlotSizes, setParkingSlotSizes] = useState({
    [Sizes.SMALL]: [],
    [Sizes.MEDIUM]: [],
    [Sizes.LARGE]: []
  });

  useEffect(() => {
    setEntryPoints([]);
  }, [parkingMapConfig.tableSize, parkingMapConfig.numEntryPoints]);
 
  useEffect(() => {
    const smallSlots = [];

    for (let rowIndex = 0; rowIndex < parkingMapConfig.tableSize; rowIndex++) {
      for (let columnIndex = 0; columnIndex < parkingMapConfig.tableSize; columnIndex++) {
        const isEntryPoint = ParkingLot.isEntryPoint(entryPoints, rowIndex, columnIndex);

        if (isEntryPoint) {
          smallSlots.filter(smallSlot => !isEqual(smallSlot, {rowIndex, columnIndex}));
        } else {
          smallSlots.push({ rowIndex, columnIndex });
        }
      }
    }

    setParkingSlotSizes({
      [Sizes.SMALL]: smallSlots,
      [Sizes.MEDIUM]: [],
      [Sizes.LARGE]: [],
    });
  }, [entryPoints]);

  return (
    <div className="app">
      <div className="container-fluid">
        <header>
          <h1 className="title" data-cy="title">Parking Lot System</h1>
        </header>

        <section data-cy="wizard-section">
          <Wizard>
            <TableConstructor
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              setParkingMapConfig={setParkingMapConfig}
            />

            <SetEntryPoints
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              setParkingMapConfig={setParkingMapConfig}
              setEntryPoints={setEntryPoints}
            />

            <SetParkingSlotSizes
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              parkingSlotSizes={parkingSlotSizes}
              setParkingMapConfig={setParkingMapConfig}
              setParkingSlotSizes={setParkingSlotSizes}
            />

            <ControlPanel
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              parkingSlotSizes={parkingSlotSizes}
              setParkingMapConfig={setParkingMapConfig}
            />
          </Wizard>
        </section>
      </div>
    </div>
  );
}

export default App;