import { FC, memo } from 'react';
import { BurgerBuilderElementUI } from '@ui';
import { BurgerBuilderElementProps } from './type';

import { useDispatch } from 'react-redux';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/builder-slice';

export const BurgerBuilderElement: FC<BurgerBuilderElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const sendAction = useDispatch();

    const shiftDown = () => {
      const next = index + 1;
      if (next < totalItems) {
        sendAction(moveIngredient({ fromIndex: index, toIndex: next }));
      }
    };

    const shiftUp = () => {
      const prev = index - 1;
      if (prev >= 0) {
        sendAction(moveIngredient({ fromIndex: index, toIndex: prev }));
      }
    };

    const remove = () => {
      sendAction(removeIngredient(ingredient.id));
    };

    return (
      <BurgerBuilderElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={shiftUp}
        handleMoveDown={shiftDown}
        handleClose={remove}
      />
    );
  }
);