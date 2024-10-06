import { v4 as uuidv4 } from 'uuid';
import { Category, DraftExpense, Expense } from '../types';

export type BudgetActions =
  | { type: 'add-budget'; payload: { budget: number } }
  | { type: 'show-modal' }
  | { type: 'close-modal' }
  | { type: 'add-expense'; payload: { expense: DraftExpense } }
  | { type: 'remove-expense'; payload: { id: Expense['id'] } }
  | { type: 'get-expense-by-id'; payload: { id: Expense['id'] } }
  | { type: 'update-expense'; payload: { expense: Expense } }
  | { type: 'reset-app' }
  | { type: 'add-filter-category'; payload: { id: Category['id'] } };

export type BudgetState = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense['id'];
  currentCategory: Category['id'];
};

// Función para obtener el presupuesto inicial
const initialBudget = (): number => {
  if (typeof window !== 'undefined') {
    const localStorageBudget = localStorage.getItem('budget');
    return localStorageBudget ? +localStorageBudget : 0;
  }
  return 0; // Retorna 0 en entornos de prueba
};

// Función para obtener los gastos del almacenamiento local
const localStorageExpenses = (): Expense[] => {
  if (typeof window !== 'undefined') {
    const localStorageExpenses = localStorage.getItem('expenses');
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
  }
  return []; // Retorna un array vacío en entornos de prueba
};

export const initialState: BudgetState = {
  budget: initialBudget(),
  modal: false,
  expenses: localStorageExpenses(),
  editingId: '',
  currentCategory: '',
};

// Función para crear un gasto
const createExpense = (draftExpense: DraftExpense): Expense => {
  return {
    ...draftExpense,
    id: uuidv4(),
  };
};

// Reductor de presupuesto
export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetActions
) => {
  switch (action.type) {
    case 'add-budget':
      return {
        ...state,
        budget: action.payload.budget,
      };
    case 'show-modal':
      return {
        ...state,
        modal: true,
      };
    case 'close-modal':
      return {
        ...state,
        modal: false,
        editingId: '',
      };
    case 'add-expense':
      const expense = createExpense(action.payload.expense);
      return {
        ...state,
        expenses: [...state.expenses, expense],
        modal: false,
      };
    case 'remove-expense':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload.id),
      };
    case 'get-expense-by-id':
      return {
        ...state,
        editingId: action.payload.id,
        modal: true,
      };
    case 'update-expense':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.expense.id ? action.payload.expense : expense
        ),
        modal: false,
        editingId: '',
      };
    case 'reset-app':
      return {
        ...state,
        budget: 0,
        expenses: [],
      };
    case 'add-filter-category':
      return {
        ...state,
        currentCategory: action.payload.id,
      };
    default:
      return state;
  }
};
