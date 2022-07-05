export const enum OrderCommand {
  BUY = 'buy',
  SELL = 'sell',
}
  
export class Order {
  command?: OrderCommand;
  price: number = 0;
  amount: number = 0;
}

export class OrderContent {
  orders: Order[] = []
}

export class OrderOutput {
  sell: OrderOutputDetail[] = [];
  buy: OrderOutputDetail[] = [];
}

export class OrderOutputDetail {
  price: number = 0;
  volume: number = 0;
}
