import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

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
  createTransaction: (transactionInput: ITransactionInput) => void;
}

const TransactionsContext = createContext<ITransactionsContextData>({} as ITransactionsContextData)

export function TransactionProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  useEffect(() => {
    api('transactions')
      .then(({data}) => setTransactions(data.transactions))
  }, [])

  async function createTransaction(transactionInput: ITransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput, 
      createdAt: new Date()
    })
    const { transaction } = response.data

    setTransactions(oldTransactions => [...oldTransactions, transaction])
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      { children }
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)

  return context;
}
