import React, { useState, useCallback } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { AppDispatch } from "../../../store";
import { registerShortCut, useAppDispatch, useAppSelector } from "../../../hooks";

import debounce from 'lodash.debounce';
import { disableEditMode, enableEditMode } from "../../../slices/appSettingsSlice";
import { invoke } from "@tauri-apps/api/tauri";

export const AppSettings: React.FC = () => {
    const dispatch: AppDispatch = useAppDispatch();
    const editStatus = useAppSelector((state) => state.appSettings.editMode);

    const settingsShortCut:string = "Alt+Enter";
    
    const [openAppSettings, setOpenAppSettings] = useState<boolean>(false);

    const handleEditModeChange = (checked:boolean) => {
        if (checked) {
            dispatch(enableEditMode());
        } else {
            dispatch(disableEditMode());
        }
    }

    const handleCloseAppSettingsDialog = ():void => {
        console.log("App Settings Closed")
        setOpenAppSettings(false);
    }

    const handleExport = ():void => {
        invoke<any>("plugin:sqlite_connector|export_database_to_csv");
    }

    // Use to prevent rapid spamming of shortcut
    // If short cut is spammed can cause shortcut to stop working
    const toggleAppSettings = useCallback(debounce(() => {
        setOpenAppSettings(true);
    }, 500), []);

    registerShortCut(settingsShortCut, toggleAppSettings);

    return (
        <Dialog open={openAppSettings} onClose={handleCloseAppSettingsDialog}>
            <DialogActions sx={{backgroundColor: '#ddd'}}>
                <DialogContent sx={{marginLeft: '10px', padding: '0px'}}>
                    <DialogContentText>
                        Application Settings
                    </DialogContentText>
                </DialogContent>
                <Button variant="contained" onClick={handleCloseAppSettingsDialog}>Close</Button>
            </DialogActions>
            <DialogContent>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch/>}
                        checked={editStatus}
                        onChange={(_, checked) => handleEditModeChange(checked)}
                        label="Edit Mode"
                    />
                </FormGroup>
                <Button variant="contained" fullWidth onClick={handleExport}>Export</Button>
            </DialogContent>
        </Dialog>
    );
}