import React, { useState } from "react";
import { AddItemForm, TestFixtureTable, TestSampleTable } from "../features";
import { AppBar, Button, Dialog, DialogActions, DialogContent, Paper, Toolbar } from "@mui/material";
import { TestCageItem } from "../enums";

export const TablePage: React.FC = () => {
    const [openAddItemDialog, setOpenAddItemDialog] = useState<boolean>(false);
    const [testCageItemTable, setTestCageItemTable] = useState<TestCageItem>(TestCageItem.TestSample);

    const handleOpenAddItemDialog = () => {
        setOpenAddItemDialog(true);
    }

    const handleCloseAddItemDialog = () => {
        setOpenAddItemDialog(false);
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Button
                        color="inherit"
                        onClick={() => setTestCageItemTable(TestCageItem.TestSample)}
                    >
                        Test Samples
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => setTestCageItemTable(TestCageItem.TestFixture)}
                    >
                        Test Fixtures
                    </Button>
                </Toolbar>
            </AppBar>
            <Button fullWidth variant="contained" onClick={handleOpenAddItemDialog}>
                Add Test Fixture / Test Sample
            </Button>
            <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseAddItemDialog}>Close</Button>
                </DialogActions>
                <DialogContent>
                    <AddItemForm/>
                </DialogContent>
            </Dialog>
            <Paper>
                {testCageItemTable === TestCageItem.TestSample ? (
                    <TestSampleTable/>
                ) : (
                    <TestFixtureTable/>
                )}
            </Paper>
        </>
    );
}