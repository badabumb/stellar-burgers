/// <reference types="cypress" />

Cypress.Commands.add('addIngredient', (category) => {
  cy.get(`[data-cy="${category}"]`)
    .find('button')
    .first()
    .click();
});

export {};