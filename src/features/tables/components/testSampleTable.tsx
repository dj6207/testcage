import { 
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField,
    Button,
} from "@mui/material";
import React, { useState } from "react";
import { TestSample } from "../../../types";
import { useAppDispatch, useGetAllTestSamples } from "../../../hooks";
import DeleteIcon from '@mui/icons-material/Delete';
import { invoke } from "@tauri-apps/api/tauri";
import { AppDispatch } from "../../../store";
import { showSnackBar } from "../../../slices/snackBarSlice";

export const TestSampleTable: React.FC = () => {
    const dispatch:AppDispatch = useAppDispatch();

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const testSamples:TestSample[] = useGetAllTestSamples();

    const handleOpenDeleteDialog = (rowId:number | null):void => {
        setSelectedRow(rowId);
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = ():void => {
        setOpenDeleteDialog(false);
        setSelectedRow(null);
    }

    const handleDeleteItem = ():void => {
        handleCloseDeleteDialog();
        if (selectedRow != null) {
            const id = selectedRow;
            invoke<number>("plugin:sqlite_connector|delete_sample_by_id", { id: id })
                .then((res) => {
                    console.log(res);
                    dispatch(showSnackBar("Test Sample Deleted"));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(showSnackBar("Fail to delete Test Sample"));
                })
        } else {
            console.log("selectedRow is null");
            dispatch(showSnackBar("Error deleting Test Sample"));
        }
    }

    return (
        <TableContainer component={Paper}>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Test Sample</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Test Sample?
                    </DialogContentText>
                    <DialogContentText>
                        This action cannot be reversed!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleDeleteItem}>Delete</Button>
                    <Button variant="contained" onClick={handleCloseDeleteDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Model</TableCell>
                        <TableCell align="right">Serial Number</TableCell>
                        <TableCell align="right">Project Association</TableCell>
                        <TableCell align="right">Production Equivalence</TableCell>
                        <TableCell align="right">Misc</TableCell>
                        <TableCell align="center">
                            <IconButton disabled={true} size="small">
                                <DeleteIcon/>
                            </IconButton>  
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testSamples.map((testSample) => (
                        <TableRow key={testSample.id} >
                            <TableCell component="th" scope="row">{testSample.name}</TableCell>    
                            <TableCell align="right">{testSample.quantity}</TableCell>   
                            <TableCell align="right">{testSample.model}</TableCell> 
                            <TableCell align="right">{testSample.serialNumber}</TableCell> 
                            <TableCell align="right">{testSample.projectAssociation}</TableCell>   
                            <TableCell align="right">{testSample.productEquivalence}</TableCell> 
                            <TableCell align="right">{testSample.misc}</TableCell>    
                            <TableCell align="center">
                                <IconButton size="small" onClick={() => {
                                    handleOpenDeleteDialog(testSample.id || null)
                                }}>
                                    <DeleteIcon/>
                                </IconButton>                             
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}