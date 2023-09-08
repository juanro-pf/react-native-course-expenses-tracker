import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Input from "./Input";
import Button from "../expenses/ui/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

export default function ExpenseForm({ onCancel, onSubmit, submitButtonLabel, defaultValues }) {
    const [inputs, setInputs] = useState({
        amount: { value: defaultValues?.amount.toString() || "", isValid: true },
        date: { value: defaultValues ? getFormattedDate(defaultValues.date) : "", isValid: true },
        description: { value: defaultValues?.description || "", isValid: true },
    });

    function inputChangeHandler(inputIdentifier, enteredAmount) {
        setInputs(prev => { return { ...prev, [inputIdentifier]: { value: enteredAmount, isValid: true } } });
    };

    function submitHandler() {
        const expenseData = {
            amount: +inputs.amount.value,
            date: new Date(inputs.date.value),
            description: inputs.description.value
        };

        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
        const dateIsValid = expenseData.date.toString() !== "Invalid Date";
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if(!amountIsValid && !dateIsValid && !descriptionIsValid) {
            // Alert.alert("Invalid Input", "Please check your input values.");
            setInputs(prev => {
                return {
                    amount: { value: prev.amount.value, isValid: amountIsValid },
                    date: { value: prev.date.value, isValid: dateIsValid },
                    description: { value: prev.description.value, isValid: descriptionIsValid }
                }
            });
            return;
        }

        onSubmit(expenseData);
    };

    const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid;

    return (
        <View style={styles.form} >
            <Text style={styles.title} >Your Expense</Text>
            <View style={styles.inputsRow} >
                <Input invalid={!inputs.amount.isValid} style={styles.rowInput} label="Amount" textInputConfig={{
                    keyboardType: "decimal-pad",
                    onChangeText: (enteredValue) => inputChangeHandler("amount", enteredValue),
                    value: inputs.amount.value
                }}
                />
                <Input invalid={!inputs.date.isValid} style={styles.rowInput} label="Date" textInputConfig={{
                    placeholder: "YYYY-MM-DD",
                    maxLength: 10,
                    onChangeText: (enteredValue) => inputChangeHandler("date", enteredValue),
                    value: inputs.date.value
                }}
                />
            </View>
            <Input invalid={!inputs.description.isValid} label="Description" textInputConfig={{
                multiline: true,
                onChangeText: (enteredValue) => inputChangeHandler("description", enteredValue),
                value: inputs.description.value
            }}
            />
            {
                formIsInvalid && <Text style={styles.errorText} >Invalid Input Values</Text>
            }
            <View style={styles.buttons} >
                <Button style={styles.button} mode="flat" onPress={onCancel} >Cancel</Button>
                <Button style={styles.button} onPress={submitHandler} >{submitButtonLabel}</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        marginTop: 40
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginVertical: 24,
        textAlign: "center",
    },
    inputsRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    rowInput: {
        flex: 1
    },
    errorText: {
        textAlign: "center",
        color: GlobalStyles.colors.error500,
        margin: 8
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8
    }
});