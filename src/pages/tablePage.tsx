import React, { useState } from "react";
import { AddItemForm, TestFixtureTable, TestSampleTable } from "../features";
import { Button, Dialog, Paper } from "@mui/material";
import { TestFixture } from "../types";
import { useAppDispatch, useGetAllTestSamples } from "../hooks";
import { setTestSampleData } from "../slices/testSampleTableSlice";

export const TablePage: React.FC = () => {
    const dispatch = useAppDispatch()
    const [openAddItemDialog, setOpenAddItemDialog] = useState<boolean>(false);

    const handleOpenAddItemDialog = () => {
        setOpenAddItemDialog(true);
    }

    const handleCloseAddItemDialog = () => {
        setOpenAddItemDialog(false);
    }

    return (
        <>
            <Button fullWidth variant="contained" onClick={handleOpenAddItemDialog}>
                Add Test Fixture / Test Sample
            </Button>
            <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
                <AddItemForm/>
            </Dialog>
            <Paper>
                <TestSampleTable/>
            </Paper>
            <Paper>
                <TestFixtureTable/>
            </Paper>
        </>
    );
}