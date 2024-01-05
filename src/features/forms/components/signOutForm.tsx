import { 
    Box, Button, Container, TextField 
} from "@mui/material";
import React, { useState } from "react";
import { SignOutFormProps } from "../../../types";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppDispatch } from "../../../hooks";
import { AppDispatch } from "../../../store";
import { showSnackBar } from "../../../slices/snackBarSlice";
import { isTestSample } from "../../../utils";

export const SignOutForm: React.FC<SignOutFormProps> = ({ signOutItem }) => {
    const dispatch: AppDispatch = useAppDispatch();

    const [inputQuantity, setInputQuantity] = useState<string>("");
    const [inputSignOutUser, setInputSignOutUser] = useState<string>("");

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
        const quantityValue = e.target.value;
        if (signOutItem != null &&  (quantityValue == '' || (/^[0-9]*$/.test(quantityValue) && parseInt(quantityValue, 10) >= 0 && parseInt(quantityValue, 10) <= signOutItem.quantity))) {
            setInputQuantity(quantityValue);
        }
    }

    const handleSignOut = (e:React.FocusEvent<HTMLFormElement>):void => {
        e.preventDefault();
        const quantity = parseInt(inputQuantity) || 0;
        if (signOutItem !== null && signOutItem?.id != undefined && quantity != 0) {
            if (isTestSample(signOutItem)) {
                signOutSampleById(signOutItem.id, quantity, inputSignOutUser);
            } else {
                signOutFixtureById(signOutItem.id, quantity, inputSignOutUser);
            }
        } else {
            dispatch(showSnackBar("Input a valid quantity"));
        }
    }

    const signOutSampleById = (id: number, quantity: number, user: string):void => {
        invoke<number>("plugin:sqlite_connector|sign_out_sample_by_id", {id: id, quantity: quantity, user: user})
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err)
                dispatch(showSnackBar("Error signing out item"));
            });
    }

    const signOutFixtureById = (id: number, quantity: number, signedOutBy: string):void => {
        invoke<number>("plugin:sqlite_connector|sign_out_fixture_by_id", {id: id, quantity: quantity, signed_out_by: signedOutBy})
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err)
                dispatch(showSnackBar("Error signing out item"));
            });
    }

    return (
        <Container component="main" maxWidth="sm">
            {signOutItem != null && (
                <Box component="form" onSubmit={handleSignOut}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label='Signed Out By'
                        value={inputSignOutUser}
                        onChange={(e) => setInputSignOutUser(e.target.value)}
                    />                    
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Sign Out Quantity"
                        value={inputQuantity}
                        onChange={handleQuantityChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                    >
                        Sign Out
                    </Button>
                </Box>
            )}
        </Container>
    );
}