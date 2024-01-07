import React, { useState, useCallback } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { AppDispatch } from "../../../store";
import { registerShortCut, useAppDispatch } from "../../../hooks";

import debounce from 'lodash.debounce';

export const AppSettings: React.FC = () => {
    const dispatch: AppDispatch = useAppDispatch();
    const settingsShortCut:string = "Alt+Enter";
    
    const [openAppSettings, setOpenAppSettings] = useState<boolean>(false);

    const handleCloseAppSettingsDialog = ():void => {
        console.log("App Settings Closed")
        setOpenAppSettings(false);
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
            </DialogContent>
        </Dialog>
    );
}