export const products = [{
    name: 'Чайник фирмы "Тафель"',
    discount: 10, // процент скидки
    count: 100, // кол-во товара на складе
    inPackage: 1, // кол-во товара в коробке(упаковке)
    price: 300, // цена без скидки
    id: 1
  },
  {
    name: 'Акустическая гитара',
    discount: 0,
    count: 5,
    inPackage: 1,
    price: 1500,
    id: 2
  },
  {
    name: 'Ыыыыыы',
    discount: 100,
    count: 0,
    inPackage: 1,
    price: 9999,
    id: 3
  },
  {
    name: 'Набор шариковых ручек',
    discount: 5,
    count: 5,
    inPackage: 8,
    price: 10.99,
    id: 4
  },
  {
    name: 'Набор отвёрток',
    discount: 0,
    count: 8,
    inPackage: 4,
    price: 18.4,
    id: 5
  },
  {
    name: 'MTX 903S',
    discount: 13,
    count: 10,
    inPackage: 1,
    price: 65000,
    id: 6
  },
  {
    name: 'Комплект листов бумаги (A5, A4, A3)',
    discount: 80,
    count: 100,
    inPackage: 3,
    price: 1234.56,
    id: 7
  }
];

  export const fields = [
    {
      label: 'Наименование товара',
      width: 300,
      name: 'name'
    },
    {
      label: 'Упаковка',
      width: 100,
      name: 'inPackage'
    },
    {
      label: 'Скидка',
      width: 100,
      name: 'discount'
    },
    {
      label: 'Цена',
      width: 100,
      name: 'price'
    },
    {
        //для корзины
      name: '',
      width: 100
  }];