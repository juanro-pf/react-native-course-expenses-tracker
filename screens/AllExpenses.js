import { StyleSheet } from "react-native";
import ExpensesOutput from "../components/expenses/ExpensesOutput";
import { useContext } from "react";
import { ExpensesContext } from "../store/expenses-context";

export default function AllExpenses() {

    const expensesContext = useContext(ExpensesContext);

    return <ExpensesOutput expenses={expensesContext.expenses} expensesPeriod="Total" fallbackText="No expenses found." />
};

const styles = StyleSheet.create({

});