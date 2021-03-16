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

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext<ITransaction[]>([])

export function TransactionProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  useEffect(() => {
    api('transactions')
      .then(({data}) => setTransactions(data.transactions))
  }, [])

  return (
    <TransactionsContext.Provider value={transactions}>
      { children }
    </TransactionsContext.Provider>
  )
}
