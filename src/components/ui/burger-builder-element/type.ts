import { TBuilderIngredient } from '@utils-types';

export type BurgerBuilderElementUIProps = {
  ingredient: TBuilderIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
};
