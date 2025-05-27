import React, { forwardRef, useMemo } from 'react';
import { useSelector, RootState } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '../../utils/types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const builderState = useSelector((state: RootState) => state.builderBurger);

  const countersMap = useMemo(() => {
    const result: Record<string, number> = {};

    builderState.ingredients.forEach((item: TIngredient) => {
      result[item._id] = (result[item._id] || 0) + 1;
    });

    if (builderState.bun) {
      result[builderState.bun._id] = 2;
    }

    return result;
  }, [builderState]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={countersMap}
      ref={ref}
    />
  );
});