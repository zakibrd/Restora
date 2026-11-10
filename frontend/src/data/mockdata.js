export const restaurant = {
  id: 1,
  name: "Pizza House",
  slug: "pizza-house",
};

export const table = {
  id: 3,
  number: "03",
  active: true,
};

export const categories = [
  {
    id: 1,
    name: "Pizzas",
    count: 10,
  },
  {
    id: 2,
    name: "Burgers",
    count: 5,
  },
  {
    id: 3,
    name: "Drinks",
    count: 9,
  },
  {
    id: 4,
    name: "Desserts",
    count: 2,
  },
];

export const menuItems = [
  {
    id: 1,
    categoryId: 1,
    name: "Margherita",
    description: "Tomato sauce, mozzarella, fresh basil",
    price: 650,
    available: true,
  },
  {
    id: 2,
    categoryId: 1,
    name: "Chicken Pizza",
    description: "Chicken, mozzarella, tomato sauce",
    price: 850,
    available: true,
  },
  {
    id: 3,
    categoryId: 1,
    name: "Four Cheese",
    description: "Mozzarella, cheddar, parmesan, blue cheese",
    price: 900,
    available: false,
  },
  {
    id: 4,
    categoryId: 2,
    name: "Classic Burger",
    description: "Beef patty, lettuce, tomato, cheese",
    price: 750,
    available: true,
  },
  {
    id: 5,
    categoryId: 2,
    name: "Chicken Burger",
    description: "Crispy chicken, lettuce, cheese, sauce",
    price: 700,
    available: true,
  },
  {
    id: 6,
    categoryId: 3,
    name: "Cola",
    description: "330ml",
    price: 150,
    available: true,
  },
  {
    id: 7,
    categoryId: 3,
    name: "Orange Juice",
    description: "Fresh orange juice",
    price: 250,
    available: true,
  },
  {
    id: 8,
    categoryId: 3,
    name: "Water",
    description: "500ml",
    price: 100,
    available: true,
  },
  {
    id: 9,
    categoryId: 4,
    name: "Chocolate Cake",
    description: "Chocolate cake with chocolate sauce",
    price: 450,
    available: true,
  },
  {
    id: 10,
    categoryId: 4,
    name: "Tiramisu",
    description: "Classic Italian tiramisu",
    price: 500,
    available: true,
  },
];
// data/mockTables.js
export const mockTables = [
  { id: 1, number: 1, status: "empty" },
  {
    id: 2,
    number: 2,
    status: "occupied",
    total: 4500,
    order: {
      id: 1041,
      time: "10:52 PM",
      status: "confirmed",
      items: [
        { name: "Margherita", quantity: 2, price: 1300 },
        { name: "Cola", quantity: 2, price: 300 },
      ],
      total: 4500,
    },
  },
  {
    id: 3,
    number: 3,
    status: "new_order",
    order: {
      id: 1046,
      time: "11:04 PM",
      status: "pending",
      items: [
        { name: "Margherita", quantity: 1, price: 850 },
        { name: "Quatre Fromages", quantity: 1, price: 1100 },
      ],
      total: 1950,
    },
  },
  { id: 4, number: 4, status: "empty" },
  {
    id: 5,
    number: 5,
    status: "occupied",
    total: 1200,
    order: {
      id: 1039,
      time: "10:15 PM",
      status: "confirmed",
      items: [
        { name: "Chicken Burger", quantity: 1, price: 700 },
        { name: "Cola", quantity: 1, price: 150 },
        { name: "Water", quantity: 1, price: 100 },
      ],
      total: 1200,
    },
  },
  { id: 6, number: 6, status: "empty" },
  { id: 7, number: 7, status: "empty" },
  { id: 8, number: 8, status: "empty" },
  { id: 9, number: 9, status: "empty" },
  { id: 10, number: 10, status: "empty" },
];
export const mockSales = [
  {
    id: "#1045",
    table: "Table 06",
    time: "11:01 PM",
    amount: 180,
    status: "completed",
    paymentMethod: "Espèces",
    items: [{ name: "Café Express", qty: 1, price: 180 }],
  },
  {
    id: "#1044",
    table: "Table 03",
    time: "11:01 PM",
    amount: 1950,
    status: "completed",
    paymentMethod: "Carte",
    items: [
      { name: "Burger Cheeseburger", qty: 2, price: 1500 },
      { name: "Frites", qty: 1, price: 250 },
      { name: "Coca Cola", qty: 2, price: 200 },
    ],
  },
  {
    id: "#1043",
    table: "Table 03",
    time: "11:00 PM",
    amount: 1280,
    status: "completed",
    paymentMethod: "Espèces",
    items: [
      { name: "Pizza Margherita", qty: 1, price: 850 },
      { name: "Jus d'Orange", qty: 2, price: 430 },
    ],
  },
  {
    id: "#1042",
    table: "Table 03",
    time: "10:56 PM",
    amount: 1830,
    status: "completed",
    paymentMethod: "Espèces",
    items: [
      { name: "Tacos Poulet", qty: 2, price: 1400 },
      { name: "Eau Minérale", qty: 2, price: 100 },
      { name: "Tiramisu", qty: 1, price: 330 },
    ],
  },
  {
    id: "#1041",
    table: "Emporter",
    time: "10:30 PM",
    amount: 650,
    status: "cancelled",
    paymentMethod: "Espèces",
    items: [{ name: "Classic Burger", qty: 1, price: 650 }],
  },
];
export const orders = [
  {
    id: 1045,
    tableNumber: 6,
    time: "11:01 PM",
    status: "TERMINÉE",
    total: 180,
  },
  {
    id: 1044,
    tableNumber: 3,
    time: "11:01 PM",
    status: "TERMINÉE",
    total: 1950,
  },
  {
    id: 1043,
    tableNumber: 3,
    time: "11:00 PM",
    status: "TERMINÉE",
    total: 1280,
  },
  {
    id: 1042,
    tableNumber: 3,
    time: "10:56 PM",
    status: "TERMINÉE",
    total: 1830,
  },
];
