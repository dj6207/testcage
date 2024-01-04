import React, { useState } from "react";
import { AddItemForm, TestFixtureTable, TestSampleTable } from "../features";
import { Button, Dialog, Paper } from "@mui/material";
import { TestFixture } from "../types";

export const TablePage: React.FC = () => {
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