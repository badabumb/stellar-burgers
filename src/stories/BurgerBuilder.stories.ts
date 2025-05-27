import { BurgerBuilderUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/BurgerBuilder',
  component: BurgerBuilderUI,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BurgerBuilderUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBuilder: Story = {
  args: {
    builderItems: { bun: null, ingredients: [] },
    orderRequest: false,
    price: 0,
    orderModalData: null,
    onOrderClick: () => {},
    closeOrderModal: () => {}
  }
};
