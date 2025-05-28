import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id: ingredientId } = useParams<{ id: string }>();
  const send = useDispatch();

  const { items: ingredientList, loading: isPending, error: loadError } = useSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    if (!ingredientList.length) {
      send(fetchIngredients());
    }
  }, [send, ingredientList.length]);

  if (isPending || !ingredientList.length) {
    return <Preloader />;
  }

  if (loadError) {
    return <p className='text text_type_main-default'>Ошибка: {loadError}</p>;
  }

  const selectedItem = ingredientList.find((el) => el._id === ingredientId!);

  if (!selectedItem) {
    return <p className='text text_type_main-default'>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={selectedItem} />;
};