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