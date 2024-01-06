import React, { useState } from "react";
import { AddItemForm, SignOutLogTable, TestFixtureTable, TestSampleTable } from "../features";
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, Paper, Toolbar } from "@mui/material";
import { TableType } from "../enums";

export const TablePage: React.FC = () => {
    const [openAddItemDialog, setOpenAddItemDialog] = useState<boolean>(false);
    const [testCageItemTable, setTestCageItemTable] = useState<TableType>(TableType.TestSampleTable);

    const handleOpenAddItemDialog = () => {
        setOpenAddItemDialog(true);
    }

    const handleCloseAddItemDialog = () => {
        setOpenAddItemDialog(false);
    }

    return (
        <>
            <ButtonGroup size="small" fullWidth variant="contained" sx={{marginTop: '10px', marginBottom: '10px'}}>
                <Button onClick={() => setTestCageItemTable(TableType.TestSampleTable)}>
                    Test Samples
                </Button>
                <Button onClick={() => setTestCageItemTable(TableType.TestFixtureTable)}>
                    Test Fixtures
                </Button>
                <Button onClick={() => setTestCageItemTable(TableType.SignOutLogTable)}>
                    Sign Out Logs
                </Button>
                <Button onClick={handleOpenAddItemDialog}>
                    Add Test Fixture / Test Sample
                </Button>
            </ButtonGroup>
            <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
                <DialogActions sx={{backgroundColor: '#ddd'}}>
                    <DialogContent sx={{marginLeft: '10px', padding: '0px'}}>
                        <DialogContentText>
                            New Test Fixture / Test Sample
                        </DialogContentText>
                    </DialogContent>
                    <Button variant="contained" onClick={handleCloseAddItemDialog}>Close</Button>
                </DialogActions>
                <DialogContent>
                    <AddItemForm/>
                </DialogContent>
            </Dialog>
            <Paper>
                {testCageItemTable === TableType.TestSampleTable && (
                    <TestSampleTable/>
                )}
                {testCageItemTable === TableType.TestFixtureTable && (
                    <TestFixtureTable/>
                )}
                {testCageItemTable === TableType.SignOutLogTable && (
                    <SignOutLogTable/>
                )}
            </Paper>
        </>
    );
}