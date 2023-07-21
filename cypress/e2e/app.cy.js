import { times } from "lodash";
import config from "../../src/config";

const entryPoints = 3;
const tableSize = 10;

function getTableCell(rowIndex, columnIndex) {
  return cy.get('[data-cy="parking-map"] table').should('be.visible').find(`tr:nth-of-type(${rowIndex + 1}) td:nth-of-type(${columnIndex + 1})`);
}

describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the title correctly', () => {
    cy.get('[data-cy="title"]').should('be.visible').should('have.text', 'Parking Lot System');
  });
});

describe('First step: Table Constructor', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the correct title', () => {
    cy.get('[data-cy="section-title"]').should('be.visible').should('have.text', 'Set table size and number of entry points');
  });

  it('should show parking map', () => {
    cy.get('[data-cy="parking-map"] table').should('be.visible');
  });

  it('should show an input field for the number of entry points', () => {
    cy.get('[data-cy="entry-point-input"] input').should('be.visible');
  });

  it('should show an input field for the table size', () => {
    cy.get('[data-cy="table-size-input"] input').should('be.visible');
  });

  it('should show the number of entry points with a default value', () => {
    cy.get('[data-cy="entry-point-input"] input').should('be.visible').should('have.value', config.MIN_ENTRY_POINTS);
  });

  it('should show the table size with a default value', () => {
    cy.get('[data-cy="table-size-input"] input').should('be.visible').should('have.value', config.MIN_ENTRY_POINTS);
  });

  it('should have a table size input that has a minimum value', () => {
    cy.get('[data-cy="table-size-input"] input').should('have.value', 3);
    cy.get('[data-cy="table-size-input"] [data-cy="stepper-decrement"]').should('be.visible').click();
    cy.get('[data-cy="table-size-input"] input').should('have.value', 3);
  });

  it('should have a table size input that has a maximum value', () => {
    times(config.MAX_TABLE_SIZE - config.MIN_ENTRY_POINTS, i => {
      cy.get('[data-cy="table-size-input"] input').should('have.value', config.MIN_ENTRY_POINTS + i);
      cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click();
    });

    cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click();
    cy.get('[data-cy="table-size-input"] input').should('have.value', config.MAX_TABLE_SIZE);
  });

  it('should have a parking map table that updates with the table size input value', () => {
    times(config.MAX_TABLE_SIZE - config.MIN_ENTRY_POINTS, i => {
      cy.get('[data-cy="parking-map"] table tr').its('length').should('eq', config.MIN_ENTRY_POINTS + i);
      cy.get('[data-cy="parking-map"] table tr').each(row => {
        cy.wrap(row).find('td').its('length').should('eq', config.MIN_ENTRY_POINTS + i);
      });
      cy.get('[data-cy="table-size-input"] input').should('have.value', config.MIN_ENTRY_POINTS + i);
      cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click();
    });
  });

  it('should have an entry point number input that has a minimum value', () => {
    cy.get('[data-cy="entry-point-input"] input').should('have.value', 3);
    cy.get('[data-cy="entry-point-input"] [data-cy="stepper-decrement"]').should('be.visible').click();
    cy.get('[data-cy="entry-point-input"] input').should('have.value', 3);
  });

  it('should have an entry point number input that has a maximum value based on the current value of the table size', () => {
    times(config.MAX_TABLE_SIZE - config.MIN_ENTRY_POINTS, i => {
      cy.get('[data-cy="entry-point-input"] input').should('have.value', config.MIN_ENTRY_POINTS + i);
      cy.get('[data-cy="entry-point-input"] [data-cy="stepper-increment"]').should('be.visible').click();
      cy.get('[data-cy="entry-point-input"] input').should('have.value', config.MIN_ENTRY_POINTS + i);

      cy.get('[data-cy="table-size-input"] input').should('have.value', config.MIN_ENTRY_POINTS + i);
      cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click();

      cy.get('[data-cy="entry-point-input"] [data-cy="stepper-increment"]').should('be.visible').click();
    });
  });

  it('should show the next button', () => {
    cy.get('[data-cy="table-constructor-next-button"]').should('be.visible');
  });

  it('should not disable the next button', () => {
    cy.get('[data-cy="table-constructor-next-button"]').should('not.be.disabled');
  });

  it('should go to the next step when the next button is clicked', () => {
    cy.get('[data-cy="table-constructor-next-button"]').click();
    cy.get('[data-cy="section-title"]').should('be.visible').should('not.have.text', 'Set table size and number of entry points');
  });
});

describe('Second step: Set Entry Points', () => {
  beforeEach(() => {
    cy.visit('/');

    times(tableSize - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click());

    times(entryPoints - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="entry-point-input"] [data-cy="stepper-increment"]').should('be.visible').click());

    cy.get('[data-cy="table-constructor-next-button"]').click();
  });

  it('should show the correct title', () => {
    cy.get('[data-cy="section-title"]').should('be.visible').should('have.text', 'Select the entry points of the parking lot');
  });

  it('should show parking map with the correct table size', () => {
    cy.get('[data-cy="parking-map"] table tr').its('length').should('eq', tableSize);
    cy.get('[data-cy="parking-map"] table tr').each(row => {
      cy.wrap(row).find('td').its('length').should('eq', tableSize);
    });
  });

  it('should set a table cell as an entry point when clicked', () => {
    cy.get('[data-cy="entry-point-list"] ul').children().should('have.length', 0);

    getTableCell(0, 0).click().should('have.class', 'clicked');
    getTableCell(0, 4).click().should('have.class', 'clicked');
    getTableCell(9, 8).click().should('have.class', 'clicked');

    cy.get('[data-cy="entry-point-list"] li').its('length').should('eq', 3);

    cy.get('[data-cy="entry-point-list"] li').contains('Row 1, Column 1').should('be.visible');
    cy.get('[data-cy="entry-point-list"] li').contains('Row 1, Column 5').should('be.visible');
    cy.get('[data-cy="entry-point-list"] li').contains('Row 10, Column 9').should('be.visible');
  });

  it('should unset an entry point table cell when clicked', () => {
    getTableCell(0, 0).click();

    cy.get('[data-cy="entry-point-list"] li').contains('Row 1, Column 1').should('be.visible');

    getTableCell(0, 0).click().should('have.not.class', 'clicked');

    cy.get('[data-cy="entry-point-list"] ul').children().should('have.length', 0);
  });

  it('should not set a table cell as an entry point if its not an edge or side cell', () => {
    getTableCell(1, 2).click().should('have.not.class', 'clicked');
    getTableCell(2, 4).click().should('have.not.class', 'clicked');
    getTableCell(3, 6).click().should('have.not.class', 'clicked');
    getTableCell(4, 8).click().should('have.not.class', 'clicked');

    cy.get('[data-cy="entry-point-list"] ul').children().should('have.length', 0);
  });

  it('should disable the next button if the selected entry points are not yet complete', () => {
    cy.get('[data-cy="set-entry-points-next-button"]').should('be.disabled');

    getTableCell(0, 0).click();

    cy.get('[data-cy="set-entry-points-next-button"]').should('be.disabled');

    getTableCell(0, 1).click();

    cy.get('[data-cy="set-entry-points-next-button"]').should('be.disabled');

    getTableCell(0, 2).click();

    cy.get('[data-cy="set-entry-points-next-button"]').should('not.be.disabled');
  });

  it('should show the next and previous buttons', () => {
    cy.get('[data-cy="set-entry-points-prev-button"]').should('be.visible');
    cy.get('[data-cy="set-entry-points-next-button"]').should('be.visible');
  });

  it('should not disable the prev button and disable the next button', () => {
    cy.get('[data-cy="set-entry-points-prev-button"]').should('not.be.disabled');
    cy.get('[data-cy="set-entry-points-next-button"]').should('be.disabled');
  });

  it('should go to the prev step when the prev button is clicked', () => {
    cy.get('[data-cy="set-entry-points-prev-button"]').click();

    cy.get('[data-cy="section-title"]').should('be.visible').should('have.text', 'Set table size and number of entry points');
  });

  it('should go to the next step when the next button is clicked', () => {
    times(entryPoints, index => getTableCell(0, index + 1).click());

    cy.get('[data-cy="set-entry-points-next-button"]').click();

    cy.get('[data-cy="section-title"]').should('be.visible').should('not.have.text', 'Select the entry points of the parking lot');
  });
});

describe('Third step: Set Parking Slot Sizes', () => {
  beforeEach(() => {
    cy.visit('/');

    times(tableSize - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click());

    times(entryPoints - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="entry-point-input"] [data-cy="stepper-increment"]').should('be.visible').click());

    cy.get('[data-cy="table-constructor-next-button"]').click();

    times(entryPoints, index => getTableCell(0, index + index).click());

    cy.get('[data-cy="set-entry-points-next-button"]').click();
  });

  it('should show the correct title', () => {
    cy.get('[data-cy="section-title"]').should('be.visible').should('have.text', 'Set the parking slot sizes');
  });

  it('should show parking map with the correct table size', () => {
    cy.get('[data-cy="parking-map"] table tr').its('length').should('eq', tableSize);
    cy.get('[data-cy="parking-map"] table tr').each(row => {
      cy.wrap(row).find('td').its('length').should('eq', tableSize);
    });
  });

  it('should have the correct entry points from the last step', () => {
    times(entryPoints, index => getTableCell(0, index + index).should('have.class', 'clicked'));
  });

  it('should not have a select option on the entry point cells', () => {
    times(entryPoints, index => getTableCell(0, index + index).find('select').should('have.length', 0));
  });

  it('should have the default slot sizes set to S (small)', () => {
    cy.get('[data-cy="parking-map"] table tr').each(row => {
      cy.wrap(row).find('td select').should('have.value', 'S');
    });
  });

  it('should let the user select the parking slot size for each cell', () => {
    getTableCell(1, 0).find('select').select('M').should('have.value', 'M');
    getTableCell(2, 3).find('select').select('L').should('have.value', 'L');
    getTableCell(3, 5).find('select').select('M').should('have.value', 'M');
    getTableCell(4, 7).find('select').select('L').should('have.value', 'L');
  });

  it('should not disable the prev button and next button', () => {
    cy.get('[data-cy="set-parking-slot-sizes-prev-button"]').should('not.be.disabled');
    cy.get('[data-cy="set-parking-slot-sizes-next-button"]').should('not.be.disabled');
  });

  it('should go to the prev step when the prev button is clicked and all the entry points are still selected', () => {
    cy.get('[data-cy="set-parking-slot-sizes-prev-button"]').click();

    times(entryPoints, index => getTableCell(0, index + index).should('have.class', 'clicked'));

    cy.get('[data-cy="section-title"]').should('be.visible').should('have.text', 'Select the entry points of the parking lot');
  });

  it('should go to the next step when the next button is clicked', () => {
    cy.get('[data-cy="set-parking-slot-sizes-next-button"]').click();

    cy.get('[data-cy="section-title"]').should('be.visible').should('not.have.text', 'Select the entry points of the parking lot');
  });
});

describe('Final step: Control Panel', () => {
  beforeEach(() => {
    cy.visit('/');

    times(tableSize - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click());

    times(entryPoints - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="entry-point-input"] [data-cy="stepper-increment"]').should('be.visible').click());

    cy.get('[data-cy="table-constructor-next-button"]').click();

    times(entryPoints, index => getTableCell(0, index + index).click());

    cy.get('[data-cy="set-entry-points-next-button"]').click();

    getTableCell(1, 1).find('select').select('M');
    getTableCell(4, 7).find('select').select('L');
    getTableCell(1, 0).find('select').select('L');

    cy.get('[data-cy="set-parking-slot-sizes-next-button"]').click();
  });

  it('should show the correct title', () => {
    cy.get('[data-cy="section-title"]').should('be.visible').should('have.text', 'Control Panel');
  });

  it('should show parking map with the correct table size', () => {
    cy.get('[data-cy="parking-map"] table tr').its('length').should('eq', tableSize);
    cy.get('[data-cy="parking-map"] table tr').each(row => {
      cy.wrap(row).find('td').its('length').should('eq', tableSize);
    });
  });

  it('should have the correct entry points from the last step', () => {
    times(entryPoints, index => getTableCell(0, index + index).should('have.class', 'clicked'));
  });

  it('should not have a select option on the entry point cells', () => {
    times(entryPoints, index => getTableCell(0, index + index).find('select').should('have.length', 0));
  });

  it('should have the correct parking slot sizes from last step', () => {
    getTableCell(1, 1).should('have.text', 'M');
    getTableCell(4, 7).should('have.text', 'L');
    getTableCell(1, 0).should('have.text', 'L');
  });

  it('should not have prev button and next button', () => {
    cy.get('.prev-button').should('have.length', 0);
    cy.get('.next-button').should('have.length', 0);
  });

  it('should show the vehicle details form when an entry point is clicked', () => {
    cy.get('[data-cy="park-vehicle-form"]').should('have.length', 0);

    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="license-plate-field"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="vehicle-size-field"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-in-field"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]').should('have.length', 0);

    cy.get('[data-cy="park-button"]').should('be.visible').should('be.disabled');
  });

  it('should auto focus on the license plate when the park vehicle form is shown', () => {
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .should('be.visible')
      .find('[data-cy="license-plate-field"]')
      .focused();
  });

  it('should mask the license plate input field', () => {
    getTableCell(0, 0).click();

    const validInput = [
      {
        userInput: 'AAA1111',
        fieldValue: 'AAA-1111',
      },
      {
        userInput: 'ABC1234',
        fieldValue: 'ABC-1234',
      },
    ];

    const invalidInput = [
      {
        userInput: '1111',
        fieldValue: '___-____',
      },
      {
        userInput: 'A#$%A1A%',
        fieldValue: 'AAA-____',
      },
      {
        userInput: '@#$%@#$@^^*&',
        fieldValue: '___-____',
      }
    ];

    validInput.forEach(({ userInput, fieldValue }) => {
      cy.get('[data-cy="license-plate-field"]', { timeout: 5000 })
        .should('be.visible')
        .clear()
        .type(userInput, { timeout: 3000 })
        .should('have.value', fieldValue);
    });

    invalidInput.forEach(({ userInput, fieldValue }) => {
      cy.get('[data-cy="license-plate-field"]', { timeout: 5000 })
        .should('be.visible')
        .clear()
        .type(userInput, { timeout: 3000 })
        .should('have.value', fieldValue);
    });
  });

  it('should have a default value of S (small) for the vehicle size field', () => {
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .should('be.visible')
      .find('[data-cy="vehicle-size-field"]')
      .should('have.value', 'S');
  });

  it('should let the users set the time in value for the vehicle', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .should('be.visible')
      .type(currentDateTime)
      .should('have.value', currentDateTime);
  });

  it('should set the minimum value for the time in field to the current datetime', () => {
    const pastDateTime = new Date(Date.now() - 1000).toISOString().slice(0, 16);
    const currentDateTime = new Date().toISOString().slice(0, 16);

    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .should('be.visible')
      .type(pastDateTime)
      .should('have.value', currentDateTime);
  });

  it('should let the user park a vehicle if all details are complete and valid', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111')
      .should('have.value', 'AAA-1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M')
      .should('have.value', 'M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime)
      .should('have.value', currentDateTime);

    cy.get('[data-cy="park-button"]').should('not.be.disabled').click();

    cy.get('.custom-toast:visible', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
  });

  it('should park the vehicle closest to the entry point', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('BBB1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible', { timeout: 10000 }).contains('BBB-1111');
    getTableCell(1, 0).should('have.text', 'BBB-1111');

    // Park 3rd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('CCC1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible', { timeout: 10000 }).contains('CCC-1111');
    getTableCell(1, 1).should('have.text', 'CCC-1111');

    // Park 4th vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('DDD1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible', { timeout: 10000 }).contains('DDD-1111');
    getTableCell(4, 7).should('have.text', 'DDD-1111');
  });

  it('should park a SMALL vehicle in ALL parking slot sizes', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('BBB1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains('BBB-1111');
    getTableCell(1, 0).should('have.text', 'BBB-1111');

    // Park 3rd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('CCC1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains('CCC-1111');
    getTableCell(1, 1).should('have.text', 'CCC-1111');
  });

  it('should park a MEDIUM vehicle in MEDIUM and LARGE parking slot sizes', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(1, 0).should('have.text', 'AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('BBB1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains('BBB-1111');
    getTableCell(1, 1).should('have.text', 'BBB-1111');
  });

  it('should park a LARGE vehicle in LARGE parking slot sizes', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(1, 0).should('have.text', 'AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('BBB1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains('BBB-1111');
    getTableCell(4, 7).should('have.text', 'BBB-1111');
  });

  it('should not park a vehicle if its already parked (same license, same size)', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible', { timeout: 10000 }).contains('Vehicle AAA-1111 is already parked');
    cy.get('[data-cy="parking-map"] table td:contains("AAA-1111")').should('have.length', 1);
  });

  it('should not park a vehicle if its already parked (same license, different size)', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible', { timeout: 10000 }).contains('Vehicle AAA-1111 is already parked');
    cy.get('[data-cy="parking-map"] table td:contains("AAA-1111")').should('have.length', 1);
  });

  it('should not park a vehicle if there is no remaining available slot', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(1, 0).should('have.text', 'AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('BBB1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    // Park 3rd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('CCC1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible', { timeout: 10000 }).contains('Sorry, no available parking slot for your vehicle.');
    cy.get('[data-cy="parking-map"] table td:contains("CCC-1111")').should('have.length', 0);
  });

  it('should show parked vehicle details when clicking on a parked vehicle', () => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDateTime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="license-plate-field"]')
      .should('be.visible')
      .should('be.disabled')
      .should('have.value', 'AAA-1111');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="vehicle-size-field"]')
      .should('be.visible')
      .should('be.disabled')
      .should('have.value', 'S');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-in-field"]')
      .should('be.visible')
      .should('be.disabled')
      .should('have.value', currentDateTime);
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]').should('be.visible');

    cy.get('[data-cy="park-button"]').should('have.length', 0);
    cy.get('[data-cy="unpark-button"]').should('be.visible').should('be.disabled');
  });

  it('should let the user set the time out for parked vehicles', () => {
    const adjustDatetime = new Date(Date.now() + 20000).toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(adjustDatetime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type(adjustDatetime)
      .should('have.value', adjustDatetime);
  });

  it('should set the minimum value for the time out field to the time in', () => {
    const adjustDatetime = new Date(Date.now() + 20000).toISOString().slice(0, 16);
    const pastDateTime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(adjustDatetime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type(pastDateTime)
      .should('have.value', adjustDatetime);
  });

  it('should unpark a vehicle', () => {
    const currentDatetime = new Date().toISOString().slice(0, 16);

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDatetime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type(currentDatetime)
      .should('have.value', currentDatetime);

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱0");

    cy.get('[data-cy="parking-map"] table td:contains("AAA-1111")').should('have.length', 0);
  });

  it('should calculate fee for a parked vehicle that stayed for 0 hours: (0)', () => {
    const currentDatetime = '2023-07-21T13:28';

    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type(currentDatetime);

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type(currentDatetime)
      .should('have.value', currentDatetime);

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱0");
  });

  it('should calculate fee for a parked vehicle that stayed for less than equal 3 hours: (40)', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-21T15:28')
      .should('have.value', '2023-07-21T15:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱40");
  });

  it('should calculate fee for a parked vehicle in a SMALL parking slot size that stayed for more than equal 3 hours: (40 + (20 * 3) = 100)', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-21T19:28')
      .should('have.value', '2023-07-21T19:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱100");
  });

  it('should calculate fee for a parked vehicle in a MEDIUM parking slot size that stayed for more than equal 3 hours: (40 + (60 * 3) = 220)', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('BBB1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    getTableCell(1, 1).should('have.text', 'BBB-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-21T19:28')
      .should('have.value', '2023-07-21T19:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle BBB-1111's parking fee is ₱220");
  });

  it('should calculate fee for a parked vehicle in a LARGE parking slot size that stayed for more than equal 3 hours: (40 + (100 * 3) = 340)', () => {
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');

    getTableCell(1, 0).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-21T19:28')
      .should('have.value', '2023-07-21T19:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱340");
  });

  it('should calculate fee for a parked vehicle that stayed for a day: (5000)', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-22T13:28')
      .should('have.value', '2023-07-22T13:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱5000");
  });

  it('should calculate fee for a parked vehicle in a SMALL parking slot size that stayed for 1 day 2 hours: (5000 + (20 * 2) = 5040)', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-22T15:28')
      .should('have.value', '2023-07-22T15:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱5040");
  });

  it('should calculate fee for a parked vehicle in a MEDIUM parking slot size that stayed for 1 day 2 hours: (5000 + (60 * 2) = 5120)', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');

    // Park 2nd vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('BBB1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    getTableCell(1, 1).should('have.text', 'BBB-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-22T15:28')
      .should('have.value', '2023-07-22T15:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle BBB-1111's parking fee is ₱5120");
  });

  it('should calculate fee for a parked vehicle in a LARGE parking slot size that stayed for more than equal 3 hours: (5000 + (100 * 2) = 5200)', () => {
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('L');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');

    getTableCell(1, 0).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-22T15:28')
      .should('have.value', '2023-07-22T15:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains("Vehicle AAA-1111's parking fee is ₱5200");
  });

  it('should set a vehicle as returning if it has the same license and returned within 1 hour', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');

    // Unpark vehicle
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-21T15:28')
      .should('have.value', '2023-07-21T15:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('[data-cy="parking-map"] table td:contains("AAA-1111")').should('have.length', 0);

    // Park vehicle again
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T16:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains('AAA-1111');

    // Check if the time in is set to the initial parking time in
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .should('have.value', '2023-07-21T13:28');
  });

  it('should set a different sized vehicle as returning if it has the same license and returned within 1 hour', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');

    // Unpark vehicle
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-21T15:28')
      .should('have.value', '2023-07-21T15:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('[data-cy="parking-map"] table td:contains("AAA-1111")').should('have.length', 0);

    // Park vehicle again
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('M');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T16:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains('AAA-1111');

    // Check if the time in is set to the initial parking time in
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .should('have.value', 'AAA-1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .should('have.value', 'S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .should('have.value', '2023-07-21T13:28');
  });

  it('should not set a vehicle as returning if it has the same license and but not returned within 1 hour', () => {
    // Park 1st vehicle
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T13:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).should('have.length', 1).contains('AAA-1111');

    // Unpark vehicle
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]').should('be.visible');
    cy.get('[data-cy="park-vehicle-form"]').find('[data-cy="time-out-field"]')
      .should('be.visible')
      .type('2023-07-21T15:28')
      .should('have.value', '2023-07-21T15:28');

    cy.get('[data-cy="unpark-button"]').should('be.visible').should('not.be.disabled').click();

    cy.get('[data-cy="parking-map"] table td:contains("AAA-1111")').should('have.length', 0);

    // Park vehicle again but more than 1 hour
    getTableCell(0, 0).click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .type('AAA1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .select('S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .type('2023-07-21T17:28');

    cy.get('[data-cy="park-button"]').click();

    cy.get('.custom-toast:visible:last-of-type', { timeout: 10000 }).contains('AAA-1111');

    // Check if the time in is set to the initial parking time in
    getTableCell(0, 1).should('have.text', 'AAA-1111').click();

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="license-plate-field"]')
      .should('have.value', 'AAA-1111');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="vehicle-size-field"]')
      .should('have.value', 'S');

    cy.get('[data-cy="park-vehicle-form"]')
      .find('[data-cy="time-in-field"]')
      .should('have.value', '2023-07-21T17:28');
  });
});