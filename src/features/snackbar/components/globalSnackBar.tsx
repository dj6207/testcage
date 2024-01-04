import React from "react";
import { Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { AppDispatch, RootState } from "../../../store";
import { hideSnackBar } from "../../../slices/snackBarSlice";
import { bottom } from "@popperjs/core";


export const GlobalSnackBar: React.FC = () => {
    const dispatch: AppDispatch = useAppDispatch();
    const { open, message } = useAppSelector((state: RootState) => state.snackBar);

    const handleCloseSnackBar = ():void => {
        dispatch(hideSnackBar());
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleCloseSnackBar}
            message={message}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        />
    );
}