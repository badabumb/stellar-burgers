import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

import styles from './builder-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerBuilder } from '../../components';
import { Preloader } from '../../components/ui';

export const BuilderPage: FC = () => {
  const sendAction = useDispatch();
  const isLoading = useSelector((state) => state.ingredients.loading);
  const hasError = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    sendAction(fetchIngredients());
  }, [sendAction]);

  if (hasError) {
    return <p className="text text_type_main-default">{hasError}</p>;
  }

  // Хотел вернуть прелоадер? Вот тебе версия без закоммента:
  // if (isLoading) {
  //   return <Preloader />;
  // }

  return (
    <main className={styles.containerMain}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerBuilder />
      </div>
    </main>
  );
};