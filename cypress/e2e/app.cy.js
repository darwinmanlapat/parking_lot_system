import { times } from "lodash";
import config from "../../src/config";

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

describe('Second step: Table Constructor', () => {
  let minEntryPoints = 3;
  let tableSize = 10;

  beforeEach(() => {
    cy.visit('/');

    times(tableSize - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="table-size-input"] [data-cy="stepper-increment"]').should('be.visible').click());

    times(minEntryPoints - config.MIN_ENTRY_POINTS, () => cy.get('[data-cy="entry-point-input"] [data-cy="stepper-increment"]').should('be.visible').click());

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
});