import { budgetReducer, initialState, BudgetActions } from '../reducers/budget-reducer';
import { DraftExpense, Expense } from '../types';

// Mock para uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

// Simulamos localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

beforeAll(() => {
  // Reemplaza localStorage por el mock
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
});

describe('Pruebas del budgetReducer', () => {
  beforeEach(() => {
    // Restablecer el mock antes de cada prueba
    mockLocalStorage.clear();
  });

  it('debería agregar presupuesto', () => {
    const action: BudgetActions = {
      type: 'add-budget',
      payload: { budget: 1000 },
    };

    const state = budgetReducer(initialState, action);

    expect(state.budget).toBe(1000);
  });

  it('debería mostrar el modal', () => {
    const action: BudgetActions = {
      type: 'show-modal',
    };

    const state = budgetReducer(initialState, action);

    expect(state.modal).toBe(true);
  });

  it('debería cerrar el modal y restablecer editingId', () => {
    const currentState = { ...initialState, modal: true, editingId: '1' };

    const action: BudgetActions = {
      type: 'close-modal',
    };

    const state = budgetReducer(currentState, action);

    expect(state.modal).toBe(false);
    expect(state.editingId).toBe('');
  });

  it('debería agregar un nuevo gasto', () => {
    const draftExpense: DraftExpense = {
      expenseName: 'Grocery',
      amount: 50,
      category: 'Food',
      date: null,
    };

    const action: BudgetActions = {
      type: 'add-expense',
      payload: { expense: draftExpense },
    };

    const state = budgetReducer(initialState, action);

    expect(state.expenses).toHaveLength(1);
    expect(state.expenses[0]).toEqual({
      ...draftExpense,
      id: 'mocked-uuid', // id generado por uuid
    });
    expect(state.modal).toBe(false);
  });

  it('debería eliminar un gasto', () => {
    const currentState = {
      ...initialState,
      expenses: [{ id: '1', expenseName: 'Grocery', amount: 50, category: 'Food', date: null }],
    };

    const action: BudgetActions = {
      type: 'remove-expense',
      payload: { id: '1' },
    };

    const state = budgetReducer(currentState, action);

    expect(state.expenses).toHaveLength(0);
  });

  it('debería establecer editingId y mostrar el modal al obtener el gasto por id', () => {
    const currentState = {
      ...initialState,
      expenses: [{ id: '1', expenseName: 'Grocery', amount: 50, category: 'Food', date: null }],
    };

    const action: BudgetActions = {
      type: 'get-expense-by-id',
      payload: { id: '1' },
    };

    const state = budgetReducer(currentState, action);

    expect(state.editingId).toBe('1');
    expect(state.modal).toBe(true);
  });

  it('debería actualizar un gasto', () => {
    const currentState = {
      ...initialState,
      expenses: [{ id: '1', expenseName: 'Grocery', amount: 50, category: 'Food', date: null }],
    };

    const updatedExpense: Expense = {
      id: '1',
      expenseName: 'Grocery - Updated',
      amount: 60,
      category: 'Food',
      date: null,
    };

    const action: BudgetActions = {
      type: 'update-expense',
      payload: { expense: updatedExpense },
    };

    const state = budgetReducer(currentState, action);

    expect(state.expenses[0].expenseName).toBe('Grocery - Updated');
    expect(state.expenses[0].amount).toBe(60);
    expect(state.modal).toBe(false);
    expect(state.editingId).toBe('');
  });

  it('debería restablecer la aplicación', () => {
    const currentState = {
      ...initialState,
      budget: 1000,
      expenses: [{ id: '1', expenseName: 'Grocery', amount: 50, category: 'Food', date: null }],
    };

    const action: BudgetActions = {
      type: 'reset-app',
    };

    const state = budgetReducer(currentState, action);

    expect(state.budget).toBe(0);
    expect(state.expenses).toHaveLength(0);
  });

  it('debería agregar una categoría de filtro', () => {
    const action: BudgetActions = {
      type: 'add-filter-category',
      payload: { id: 'food-category' },
    };

    const state = budgetReducer(initialState, action);

    expect(state.currentCategory).toBe('food-category');
  });
});
