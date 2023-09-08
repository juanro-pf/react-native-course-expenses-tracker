import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import IconButton from "../components/expenses/ui/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/manageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/expenses/ui/LoadingOverlay";
import ErrorOverlay from "../components/expenses/ui/ErrorOverlay";

export default function ManageExpense({ route, navigation }) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const expensesContext = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesContext.expenses.find(expense => expense.id === editedExpenseId);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? "Edit Expense" : "Add Expense"
        })
    }, [navigation, isEditing]);

    async function deleteExpenseHandler() {
        setIsSubmitting(true);
        try {
            await deleteExpense(editedExpenseId);
            expensesContext.deleteExpense(editedExpenseId);
            navigation.goBack();
        } catch (error) {
            setError("Could not delete expense, please try again later.");
            setIsSubmitting(false); // Commented as the component will close anyway
        }
    };

    function cancelHandler() {
        navigation.goBack();
    };

    async function confirmHandler(expenseData) {
        setIsSubmitting(true);
        try {
            if(isEditing) {
                expensesContext.updateExpense(editedExpenseId, expenseData);
                await updateExpense(editedExpenseId, expenseData);
            }
            else {
                const id = storeExpense(expenseData);
                expensesContext.addExpense({...expenseData, id});
            }
            navigation.goBack();
        } catch (error) {
            setError("Could not save data, please try again later.");
            setIsSubmitting(false); // Commented as the component will close anyway
        }
    };
    
    if(error && !isSubmitting) return <ErrorOverlay message={error} />

    if(isSubmitting) return <LoadingOverlay />

    return <View style={styles.container} >
        <ExpenseForm
            submitButtonLabel={isEditing ? "Update" : "Add"}
            onCancel={cancelHandler}
            onSubmit={confirmHandler}
            defaultValues={selectedExpense}
        />
        {isEditing &&
            <View style={styles.deleteContainer} >
                <IconButton icon="trash" color={GlobalStyles.colors.error500} size={36} onPress={deleteExpenseHandler} />
            </ View>
        }
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: "center"
    }
});