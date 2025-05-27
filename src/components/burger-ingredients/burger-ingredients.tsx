import React, { FC, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  const allIngredients = useSelector((state) => state.ingredients.items);

  const bunList = allIngredients.filter((i) => i.type === 'bun');
  const sauceList = allIngredients.filter((i) => i.type === 'sauce');
  const fillingList = allIngredients.filter((i) => i.type === 'main');

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');

  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const sauceTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);

  const [bunSectionRef, isBunVisible] = useInView({ threshold: 0 });
  const [mainSectionRef, isMainVisible] = useInView({ threshold: 0 });
  const [sauceSectionRef, isSauceVisible] = useInView({ threshold: 0 });

  useEffect(() => {
    if (isBunVisible) {
      setActiveTab('bun');
    } else if (isSauceVisible) {
      setActiveTab('sauce');
    } else if (isMainVisible) {
      setActiveTab('main');
    }
  }, [isBunVisible, isSauceVisible, isMainVisible]);

  const switchTab = (tab: string) => {
    setActiveTab(tab as TTabMode);

    if (tab === 'bun') bunTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main') mainTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce') sauceTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={bunList}
      mains={fillingList}
      sauces={sauceList}
      titleBunRef={bunTitleRef}
      titleMainRef={mainTitleRef}
      titleSaucesRef={sauceTitleRef}
      bunsRef={bunSectionRef}
      mainsRef={mainSectionRef}
      saucesRef={sauceSectionRef}
      onTabClick={switchTab}
    />
  );
};