import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({ description, amount, date }) => { },
    setExpenses: (expenses) => { },
    deleteExpense: ({ id }) => { },
    updateExpense: (id, { description, amount, date }) => { }
});

function expensesReducer(state, action) {
    switch (action.type) {
        case "ADD":
            return [action.payload, ...state];
        case "SET":
            const invertedArray = action.payload.reverse();
            return invertedArray;
        case "UPDATE":
            const updatableExpenseIndex = state.findIndex(expense => expense.id === action.payload.id);
            const updatableExpense = state[updatableExpenseIndex];
            const updatedItem = { ...updatableExpense, ...action.payload.data };
            const upadtedExpenses = [...state];
            upadtedExpenses[updatableExpenseIndex] = updatedItem;
            return upadtedExpenses
        case "DELETE":
            return state.filter(expense => expense.id !== action.payload)
        default: return state
    }
};

export default function ExpensesContextProvider({ children }) {

    const [expensesState, dispatch] = useReducer(expensesReducer, []);

    function addExpense(expenseData) {
        dispatch({ type: "ADD", payload: expenseData });
    }

    function setExpenses(expenses) {
        dispatch({ type: "SET", payload: expenses });
    }

    function deleteExpense(id) {
        dispatch({ type: "DELETE", payload: id });
    }

    function updateExpense(id, expenseData) {
        dispatch({ type: "UPDATE", payload: { id, data: expenseData } });
    }

    const value = {
        expenses: expensesState,
        addExpense: addExpense,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense,
        setExpenses: setExpenses
    };

    return <ExpensesContext.Provider value={value} >
        {children}
    </ExpensesContext.Provider>
};