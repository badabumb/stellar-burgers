import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-builder.module.css';
import { BurgerBuilderUIProps } from './type';
import { TBuilderIngredient } from '@utils-types';
import { BurgerBuilderElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerBuilderUI: FC<BurgerBuilderUIProps> = ({
  builderItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section className={styles.burger_builder}>
    {builderItems.bun ? (
      <div className={`${styles.element} mb-4 mr-4`}>
        <ConstructorElement
          type='top'
          isLocked
          text={`${builderItems.bun.name} (верх)`}
          price={builderItems.bun.price}
          thumbnail={builderItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}
    <ul className={styles.elements}>
      {builderItems.ingredients.length > 0 ? (
        builderItems.ingredients.map(
          (item: TBuilderIngredient, index: number) => (
            <BurgerBuilderElement
              ingredient={item}
              index={index}
              totalItems={builderItems.ingredients.length}
              key={item.id}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите начинку
        </div>
      )}
    </ul>
    {builderItems.bun ? (
      <div className={`${styles.element} mt-4 mr-4`}>
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${builderItems.bun.name} (низ)`}
          price={builderItems.bun.price}
          thumbnail={builderItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}
    <div className={`${styles.total} mt-10 mr-4`}>
      <div className={`${styles.cost} mr-10`}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        children='Оформить заказ'
        onClick={onOrderClick}
      />
    </div>

    {orderRequest && (
      <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
        <Preloader />
      </Modal>
    )}

    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
      >
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}
  </section>
);
