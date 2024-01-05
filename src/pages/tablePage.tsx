import React, { useState } from "react";
import { AddItemForm, TestFixtureTable, TestSampleTable } from "../features";
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, Paper, Toolbar } from "@mui/material";
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
            <ButtonGroup size="small" fullWidth variant="contained" sx={{marginTop: '10px', marginBottom: '10px'}}>
                <Button onClick={() => setTestCageItemTable(TestCageItem.TestSample)}>
                    Test Samples
                </Button>
                <Button onClick={() => setTestCageItemTable(TestCageItem.TestFixture)}>
                    Test Fixtures
                </Button>
                <Button onClick={handleOpenAddItemDialog}>
                    Add Test Fixture / Test Sample
                </Button>
            </ButtonGroup>
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