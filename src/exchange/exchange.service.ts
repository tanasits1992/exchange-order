import { Order, OrderCommand, OrderContent, OrderOutput, OrderOutputDetail } from './exchange.interface'
import { FileManagement } from '../shared/file/file'

function matchOrder(curr: Order, accs: Order[]) {
  for (let i = 0; i < accs.length; i++) {
    let acc = accs[i]

    if ((curr.command === OrderCommand.BUY && acc.price <= curr.price) || 
    (curr.command === OrderCommand.SELL && acc.price >= curr.price)) {
      if (acc.amount > curr.amount) {
        acc.amount -= curr.amount;
        curr.amount = 0;
      } else {
        curr.amount -= acc.amount;
        accs.splice(i, 1);
        i--;
      }
    } else {
      break;
    }
  }
}

function insertAndSortOrder(arr: Order[], curr: Order) {
  if (curr.amount > 0) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].price === curr.price) {
        arr[i].amount += curr.amount;
        break;
      } 
    }
  
    if (i === arr.length) {
      arr.push({ price: curr.price, amount: curr.amount });
      arr.sort((a, b) => curr.command === OrderCommand.BUY ? b.price - a.price : a.price - b.price);
    }
  }
}


export function exchange(content: OrderContent): OrderOutput {
  try {
    
    let buyOrders: Order[] = Array();
    let sellOrders: Order[] = Array();

    for (let order of content.orders) {
      if (order.command === OrderCommand.BUY) {
        matchOrder(order, sellOrders);
        insertAndSortOrder(buyOrders, order);
      } else if (order.command === OrderCommand.SELL){
        matchOrder(order, buyOrders);
        insertAndSortOrder(sellOrders, order);
      }
    }

    let buy: OrderOutputDetail[] = buyOrders.map(e => {
      return {
        "price": e.price,
        "volume": Number(e.amount.toFixed(3)),
      }
    })

    let sell: OrderOutputDetail[] = sellOrders.map(e => {
      return {
        "price": e.price,
        "volume": Number(e.amount.toFixed(3)),
      }
    })

    let output: OrderOutput = {
      buy,
      sell,
    }

    return output

  } catch (ierr) {
    throw ierr;
  }
}