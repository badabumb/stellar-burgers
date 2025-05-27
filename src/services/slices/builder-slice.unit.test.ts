import { describe, test, expect, jest } from '@jest/globals';
import {
  builderReducer,
  builderInitialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearBuilder,
  clearBun,
  setBun,
} from './builder-slice';

import { nanoid } from '@reduxjs/toolkit';
import type { BuilderState } from './builder-slice';

jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual<typeof import('@reduxjs/toolkit')>('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: jest.fn(() => 'mocked-id'),
  };
});

describe('builderReducer unit', () => {
  const mockState: BuilderState = {
    bun: {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      id: 'b1',
    },
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa093f',
        name: 'Мясо бессмертных моллюсков Protostomia',
        type: 'main',
        proteins: 433,
        fat: 244,
        carbohydrates: 33,
        calories: 420,
        price: 1337,
        image: 'https://code.s3.yandex.net/react/code/meat-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
        id: 'm1',
      },
      {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
        id: 's1',
      }
    ],
  };

  test('очищает конструктор', () => {
    const resultState: BuilderState = { bun: null, ingredients: [] };
    const actual = builderReducer(mockState, clearBuilder());
    expect(actual).toEqual(resultState);
  });

  test('перемещает ингредиент вниз', () => {
    const resultState: BuilderState = {
      ...mockState,
      ingredients: [mockState.ingredients[1], mockState.ingredients[0]],
    };
    const actual = builderReducer(mockState, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(actual).toEqual(resultState);
  });

  test('удаляет ингредиент по id', () => {
    const resultState: BuilderState = {
      ...mockState,
      ingredients: mockState.ingredients.filter((i) => i.id !== 'm1'),
    };
    const actual = builderReducer(mockState, removeIngredient('m1'));
    expect(actual).toEqual(resultState);
  });

  test('добавляет новый ингредиент', () => {
    const item = {
      _id: '643d69a5c3f7b9001cfa0948',
      name: 'Кристаллы марсианских альфа-сахаридов',
      type: 'main',
      proteins: 234,
      fat: 432,
      carbohydrates: 111,
      calories: 189,
      price: 762,
      image: 'https://code.s3.yandex.net/react/code/core.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/core-large.png',
    };

    const resultState: BuilderState = {
      ...mockState,
      ingredients: [...mockState.ingredients, { ...item, id: 'mocked-id' }],
    };

    const actual = builderReducer(mockState, addIngredient(item));
    expect(nanoid).toHaveBeenCalled();
    expect(actual).toEqual(resultState);
  });

  test('обнуляет булку', () => {
    const resultState: BuilderState = {
      ...mockState,
      bun: null,
    };
    const actual = builderReducer(mockState, clearBun());
    expect(actual).toEqual(resultState);
  });

  test('устанавливает новую булку', () => {
    const bun = {
      _id: '643d69a5c3f7b9001cfa0999',
      name: 'Фиолетовая булка Galaxy-X',
      type: 'bun',
      proteins: 22,
      fat: 12,
      carbohydrates: 33,
      calories: 300,
      price: 500,
      image: 'some.png',
      image_mobile: 'some-m.png',
      image_large: 'some-l.png',
    };

    const resultState: BuilderState = {
      ...mockState,
      bun: { ...bun, id: 'mocked-id' },
    };

    const actual = builderReducer(mockState, setBun(bun));
    expect(actual).toEqual(resultState);
  });
});