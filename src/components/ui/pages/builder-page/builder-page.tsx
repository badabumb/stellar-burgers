import { FC } from 'react';

import styles from './builder-page.module.css';

import { BuilderPageUIProps } from './type';
import { Preloader } from '@ui';
import { BurgerIngredients, BurgerBuilder } from '@components';

export const BuilderPageUI: FC<BuilderPageUIProps> = ({
  isIngredientsLoading
}) => (
  <>
    {isIngredientsLoading ? (
      <Preloader />
    ) : (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerBuilder />
        </div>
      </main>
    )}
  </>
);
