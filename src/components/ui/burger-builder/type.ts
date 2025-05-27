import { TOrder } from '@utils-types';

export type BurgerBuilderUIProps = {
  builderItems: any;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
