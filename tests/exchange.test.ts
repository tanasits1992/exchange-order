import { OrderCommand } from '../src/exchange/exchange.interface';
import { exchange } from '../src/exchange/exchange.service'
import { FileManagement } from '../src/shared/file/file';

describe('testing exchange', () => {
  test('empty orders', () => {
    let content = {
      "orders": []
    }

    expect(exchange(content)).toMatchObject({
      sell: [],
      buy: [],
    })
  })

  test('merge buy and sell', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.BUY, "price": 1.5, "amount": 1},
        {"command": OrderCommand.BUY, "price": 1.5, "amount": 1},
        {"command": OrderCommand.BUY, "price": 1.5, "amount": 1},
        {"command": OrderCommand.SELL, "price": 3, "amount": 1},
        {"command": OrderCommand.SELL, "price": 3, "amount": 1},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [
        {"price": 1.5,"volume": 3}
      ],
      sell: [
        {"price": 3,"volume": 2}
      ],
    })
  })

  test('match fully order', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.BUY, "price": 3, "amount": 1},
        {"command": OrderCommand.BUY, "price": 3, "amount": 1},
        {"command": OrderCommand.SELL, "price": 3, "amount": 1},
        {"command": OrderCommand.SELL, "price": 3, "amount": 1},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [],
      sell: [],
    })
  })

  test('merge and match fully order', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.BUY, "price": 3, "amount": 1.5},
        {"command": OrderCommand.BUY, "price": 3, "amount": 1},
        {"command": OrderCommand.BUY, "price": 3, "amount": 2},
        {"command": OrderCommand.SELL, "price": 3, "amount": 3.5},
        {"command": OrderCommand.SELL, "price": 3, "amount": 1},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [],
      sell: [],
    })
  })

  test('match order and remain buy', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.BUY, "price": 3, "amount": 1.5},
        {"command": OrderCommand.BUY, "price": 3, "amount": 1},
        {"command": OrderCommand.BUY, "price": 3, "amount": 2},
        {"command": OrderCommand.SELL, "price": 3, "amount": 3},
        {"command": OrderCommand.SELL, "price": 3, "amount": 1},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [
        {"price": 3,"volume": 0.5}
      ],
      sell: [],
    })
  })

  test('match order and remain sell', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.BUY, "price": 3, "amount": 1.5},
        {"command": OrderCommand.BUY, "price": 3, "amount": 1},
        {"command": OrderCommand.BUY, "price": 3, "amount": 2},
        {"command": OrderCommand.SELL, "price": 3, "amount": 3},
        {"command": OrderCommand.SELL, "price": 3, "amount": 3},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [],
      sell: [
        {"price": 3,"volume": 1.5}
      ],
    })
  })

  test('match order with buy more than sell', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.BUY, "price": 3.5, "amount": 3},
        {"command": OrderCommand.SELL, "price": 3, "amount": 3},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [],
      sell: [],
    })
  })

  test('not match order with buy less than sell', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.BUY, "price": 2.5, "amount": 3},
        {"command": OrderCommand.SELL, "price": 3, "amount": 3},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [
        {"price": 2.5,"volume": 3}
      ],
      sell: [
        {"price": 3,"volume": 3}
      ],
    })
  })

  test('example 1', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.SELL, "price": 100.003, "amount": 2.4},
        {"command": OrderCommand.BUY, "price": 90.394, "amount": 3.445},
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [
        {"price": 90.394,"volume": 3.445}
      ],
      sell: [
        {"price": 100.003,"volume": 2.4}
      ],
    })
  })

  test('example 2', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.SELL, "price": 100.003, "amount": 2.4},
        {"command": OrderCommand.BUY, "price": 90.394, "amount": 3.445},
        {"command": OrderCommand.BUY, "price": 89.394, "amount": 4.3},
        {"command": OrderCommand.SELL, "price": 100.013, "amount": 2.2},
        {"command": OrderCommand.BUY, "price": 90.15, "amount": 1.305},
        {"command": OrderCommand.BUY, "price": 90.394, "amount": 1.0}
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [
        {"price": 90.394,"volume": 4.445},
        {"price": 90.15,"volume": 1.305},
        {"price": 89.394,"volume": 4.3},
      ],
      sell: [
        {"price": 100.003,"volume": 2.4},
        {"price": 100.013,"volume": 2.2}
      ],
    })
  })

  test('example 3', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.SELL, "price": 100.003, "amount": 2.4},
        {"command": OrderCommand.BUY, "price": 90.394, "amount": 3.445},
        {"command": OrderCommand.BUY, "price": 89.394, "amount": 4.3},
        {"command": OrderCommand.SELL, "price": 100.013, "amount": 2.2},
        {"command": OrderCommand.BUY, "price": 90.15, "amount": 1.305},
        {"command": OrderCommand.BUY, "price": 90.394, "amount": 1.0},
        {"command": OrderCommand.SELL, "price": 90.394, "amount": 2.2}   
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [
        {"price": 90.394,"volume": 2.245},
        {"price": 90.15,"volume": 1.305},
        {"price": 89.394,"volume": 4.3},
      ],
      sell: [
        {"price": 100.003,"volume": 2.4},
        {"price": 100.013,"volume": 2.2}
      ],
    })
  })

  test('example 4', () => {
    let content = {
      "orders": [
        {"command": OrderCommand.SELL, "price": 100.003, "amount": 2.4},
        {"command": OrderCommand.BUY, "price": 90.394, "amount": 3.445},
        {"command": OrderCommand.BUY, "price": 89.394, "amount": 4.3},
        {"command": OrderCommand.SELL, "price": 100.013, "amount": 2.2},
        {"command": OrderCommand.BUY, "price": 90.15, "amount": 1.305},
        {"command": OrderCommand.BUY, "price": 90.394, "amount": 1.0},
        {"command": OrderCommand.SELL, "price": 90.394, "amount": 2.2},
        {"command": OrderCommand.SELL, "price": 90.15, "amount": 3.4},      
        {"command": OrderCommand.BUY, "price": 91.33, "amount": 1.8},      
        {"command": OrderCommand.BUY, "price": 100.01, "amount": 4.0},        
        {"command": OrderCommand.SELL, "price": 100.15, "amount": 3.8}   
      ]
    }

    expect(exchange(content)).toMatchObject({
      buy: [
        {"price": 100.01,"volume": 1.6},
        {"price": 91.33,"volume": 1.8},
        {"price": 90.15,"volume": 0.15},
        {"price": 89.394,"volume": 4.3},
      ],
      sell: [
        {"price": 100.013,"volume": 2.2},
        {"price": 100.15,"volume": 3.8}
      ],
    })
  })

});
