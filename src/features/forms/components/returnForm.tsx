import { Box, Button, Container } from "@mui/material";
import React from "react";
import { ReturnFormProps } from "../../../types";
import { AppDispatch } from "../../../store";
import { useAppDispatch } from "../../../hooks";
import { showSnackBar } from "../../../slices/snackBarSlice";
import { invoke } from "@tauri-apps/api/tauri";

export const ReturnForm: React.FC<ReturnFormProps> = ({ signOutLog }) => {
    const dispatch: AppDispatch = useAppDispatch();

    const handleReturn = (e:React.FocusEvent<HTMLFormElement>):void => {
        e.preventDefault();
        if (signOutLog != null && signOutLog?.id != null) {
            if (signOutLog.testSampleId != undefined) {
                returnSampleById(signOutLog.id, signOutLog.testSampleId, signOutLog.signedOutQuantity);
            } else if (signOutLog.testFixtureId != undefined) {
                returnFixtureById(signOutLog.id, signOutLog.testFixtureId, signOutLog.signedOutQuantity);
            } else {
                dispatch(showSnackBar("Test Sample or Test Fixture does not exist"));
            }
        } else {
            dispatch(showSnackBar("Input a valid quantity"));
        }
    }

    const returnSampleById = (id:number, testSampleId:number, quantity:number):void => {
        invoke<number>("plugin:sqlite_connector|return_sample_by_id", {id: id, testSampleId: testSampleId, quantity: quantity})
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err);
                dispatch(showSnackBar("Error returning sample"));
            });
    }

    const returnFixtureById = (id:number, testFixtureId:number, quantity:number):void => {
        invoke<number>("plugin:sqlite_connector|return_fixture_by_id", {id: id, testFixtureId: testFixtureId, quantity: quantity})
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err);
                dispatch(showSnackBar("Error returning fixture"));
            })
    }

    return (
        <Container component="main" maxWidth="sm">
            {signOutLog != null && (
                <Box component="form" onSubmit={handleReturn}>    
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                    >
                        Return
                    </Button>                
                </Box>
            )}
        </Container>
    );
}