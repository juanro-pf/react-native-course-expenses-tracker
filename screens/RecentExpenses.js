import { StyleSheet } from "react-native";
import ExpensesOutput from "../components/expenses/ExpensesOutput";
import { useContext, useEffect, useState } from "react";
import { getDateMinusDays } from "../util/date";
import { ExpensesContext } from "../store/expenses-context";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/expenses/ui/LoadingOverlay";
import ErrorOverlay from "../components/expenses/ui/ErrorOverlay";

export default function RecentExpenses() {

    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();

    const expensesContext = useContext(ExpensesContext);

    useEffect(() => {
        async function getExpenses() {
            setIsFetching(true);
            try {
                const expenses = await fetchExpenses();
                expensesContext.setExpenses(expenses);
            } catch (error) {
                setError("Could not fetch expenses.");
            }
            setIsFetching(false);
        }
        getExpenses()
    }, []);

    if(error && !isFetching) return <ErrorOverlay message={error} />

    if(isFetching) return <LoadingOverlay />

    const recentExpenses = expensesContext.expenses.filter(expense => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);

        return (expense.date >= date7DaysAgo) && (expense.date <= today);
    });

    return <ExpensesOutput expenses={recentExpenses} expensesPeriod="Last 7 days" fallbackText="No expenses registered for the past 7 days." />
};

const styles = StyleSheet.create({

});