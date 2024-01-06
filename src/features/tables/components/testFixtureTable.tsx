import { 
    Button,
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
    TextField
} from "@mui/material";
import React, { useState } from "react";
import { TestFixture } from "../../../types";
import { useAppDispatch, useGetAllTestFixtures } from "../../../hooks";
import { invoke } from "@tauri-apps/api/tauri";
import { showSnackBar } from "../../../slices/snackBarSlice";
import DeleteIcon from '@mui/icons-material/Delete';

export const TestFixtureTable: React.FC = () => {
    const dispatch = useAppDispatch();

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const testFixtures:TestFixture[] = useGetAllTestFixtures();

    const handleOpenDeleteDialog = (rowId:number | null):void => {
        setSelectedRow(rowId);
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = ():void => {
        setOpenDeleteDialog(false);
    }

    const handleDeleteItem = ():void => {
        handleCloseDeleteDialog();
        if (selectedRow != null) {
            const id = selectedRow;
            invoke<number>("plugin:sqlite_connector|delete_fixture_by_id", { id: id })
                .then((res) => {
                    console.log(res);
                    dispatch(showSnackBar("Test Fixture Deleted"));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(showSnackBar("Fail to delete Test Fixture"));
                })
        } else {
            console.log("selectedRow is null");
            dispatch(showSnackBar("Error deleting Test Fixture"));            
        }
    }

    return (
        <TableContainer component={Paper}>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Test Fixture</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Test Fixture?
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
                        <TableCell align="right">Project Association</TableCell>
                        <TableCell align="right">Misc</TableCell>
                        <TableCell align="center">
                            <IconButton disabled={true} size="small">
                                <DeleteIcon/>
                            </IconButton>  
                        </TableCell>                        
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testFixtures.map((testFixture) => (
                        <TableRow key={testFixture.id}>
                            <TableCell component="th" scope="row">{testFixture.name}</TableCell>    
                            <TableCell align="right">{testFixture.quantity}</TableCell>   
                            <TableCell align="right">{testFixture.projectAssociation}</TableCell>   
                            <TableCell align="right">{testFixture.misc}</TableCell>  
                            <TableCell align="center">
                                <IconButton size="small" onClick={() => {
                                    handleOpenDeleteDialog(testFixture.id || null)
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