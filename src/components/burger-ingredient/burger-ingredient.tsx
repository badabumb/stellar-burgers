import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from 'react-redux';
import { addIngredient, setBun } from '../../services/slices/builder-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const action = useDispatch();
    const currentLocation = useLocation();

    const onSelect = () => {
      if (ingredient.type === 'bun') {
        action(setBun(ingredient));
      } else {
        action(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: currentLocation }}
        handleAdd={onSelect}
      />
    );
  }
);