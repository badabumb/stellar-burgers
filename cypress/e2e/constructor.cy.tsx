import { setCookie, deleteCookie } from '../../src/utils/cookie';

const BASE_URL = 'https://norma.nomoreparties.space/api';

describe('Проверка конструктора бургера (UI)', () => {
  beforeEach(() => {
    setCookie('accessToken', 'Bearer fake.token.for.test');
    localStorage.setItem('refreshToken', 'fake-refresh-token-123');

    cy.intercept('GET', `${BASE_URL}/auth/user`, { fixture: 'user.json' }).as('userRequest');
    cy.intercept('GET', `${BASE_URL}/ingredients`, { fixture: 'ingredients.json' }).as('ingredientsRequest');

    cy.visit('/');
    cy.wait('@userRequest');
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('добавление ингредиентов', () => {
    cy.get('[data-cy="builder"]').as('zone');

    cy.get('[data-cy="Булки"]').find('button').first().click();
    cy.get('[data-cy="Начинки"]').find('button').first().click();

    cy.get('@zone').should('contain', 'Флюоресцентная булка R2-D3');
    cy.get('@zone').should('contain', 'Мясо бессмертных моллюсков Protostomia');
  });

  it('открытие и закрытие модалки ингредиента', () => {
    cy.get('[data-cy="ingredient-item"]').contains('Флюоресцентная булка R2-D3').click();
    cy.get('[data-cy="modal"]').should('exist').and('contain', 'Флюоресцентная булка R2-D3');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="ingredient-item"]').contains('Флюоресцентная булка R2-D3').click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создание заказа и отображение модального окна с номером', () => {
    cy.intercept('POST', `${BASE_URL}/orders`, { fixture: 'order.json' }).as('orderRequest');

    cy.get('[data-cy="Булки"]').find('button').first().click();
    cy.get('[data-cy="Начинки"]').find('button').first().click();

    cy.get('[data-cy="builder"]').find('button').contains('Оформить заказ').click({ force: true });

    cy.wait('@orderRequest');

    cy.get('[data-cy="modal"]').as('orderModal').should('exist');
    cy.get('@orderModal').invoke('text').should('include', '88191');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('@orderModal').should('not.exist');

    cy.get('[data-cy="builder"]').should('not.contain', 'Флюоресцентная булка R2-D3');
    cy.get('[data-cy="builder"]').should('not.contain', 'Мясо бессмертных моллюсков Protostomia');
  });
});