import { times } from "lodash";
import config from "../../src/config";

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