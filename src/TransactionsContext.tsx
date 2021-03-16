import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from './services/api'

interface ITransaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type ITransactionInput = Omit<ITransaction, 'id' | 'createdAt'>

interface TransactionsProviderProps {
  children: ReactNode;
}

interface ITransactionsContextData {
  transactions: ITransaction[];
  createTransaction: (transaction: ITransactionInput) => void;
}

export const TransactionsContext = createContext<ITransactionsContextData>({} as ITransactionsContextData)

export function TransactionProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  useEffect(() => {
    api('transactions')
      .then(({data}) => setTransactions(data.transactions))
  }, [])

  function createTransaction(transaction: ITransactionInput) {
    api.post('/transactions', transaction)
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      { children }
    </TransactionsContext.Provider>
  )
}
