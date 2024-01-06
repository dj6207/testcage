import { 
    Button,
    ButtonGroup,
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
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export const TestFixtureTable: React.FC = () => {
    const dispatch = useAppDispatch();

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedTestFixture, setSelectedTestFixture] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const [inputName, setInputName] = useState<string>("");
    const [inputQuantity, setInputQuantity] = useState<string>("");
    const [inputProjectAssociation, setInputProjectAssociation] = useState<string>("");
    const [inputMisc, setInputMisc] = useState<string>("");

    const testFixtures:TestFixture[] = useGetAllTestFixtures();

    const handleOpenDeleteDialog = (testFixtureId:number | null):void => {
        setSelectedTestFixture(testFixtureId);
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = ():void => {
        setOpenDeleteDialog(false);
        setSelectedTestFixture(null);
    }

    const handleOpenSettings = (row: number, testFixture:TestFixture):void => {
        if (selectedRow === null) {
            setSelectedRow(row);

            setInputName(testFixture.name);
            setInputQuantity(testFixture.quantity.toString());
            setInputProjectAssociation(testFixture.projectAssociation || '');
            setInputMisc(testFixture.misc || '');
        }
    }

    const handleCloseSettings = ():void => {
        setSelectedRow(null);

        setInputName('');
        setInputQuantity('');
        setInputProjectAssociation('');
        setInputMisc('');
    }

    const handleDeleteItem = ():void => {
        handleCloseDeleteDialog();
        handleCloseSettings();
        if (selectedTestFixture != null) {
            const id = selectedTestFixture;
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
            console.log("selectedTestFixture is null");
            dispatch(showSnackBar("Error deleting Test Fixture"));            
        }
    }

    const handleUpdateItem = (testFixture:TestFixture):void => {
        handleCloseSettings();
        if (testFixture.id != null) {
            const updatedTestFixture:TestFixture = {
                id: testFixture.id,
                name: inputName,
                quantity: parseInt(inputQuantity) || testFixture.quantity,
                projectAssociation: inputProjectAssociation,
                misc: inputMisc,
            }
            updateTestFixture(updatedTestFixture);
        } else {
            console.log("testFixture is null");
            dispatch(showSnackBar("Error Updating Test Fixture"));
        }
    }

    const updateTestFixture = (item:TestFixture):void => {
        invoke<number>("plugin:sqlite_connector|update_test_fixture_by_id", {item: item})
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err);
                dispatch(showSnackBar("Error Updating Test Fixture"))
            })
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
                    {testFixtures.map((testFixture, index) => (
                        <TableRow key={testFixture.id}>
                            <TableCell component="th" scope="row">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputName}
                                        onChange={(e) => setInputName(e.target.value)}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testFixture.name
                                )}
                            </TableCell>    
                            <TableCell align="right">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputQuantity}
                                        onChange={(e) => {
                                            const quantityValue = e.target.value;
                                            if (quantityValue == '' || /^[0-9]*$/.test(quantityValue)) {
                                                setInputQuantity(quantityValue)
                                            }
                                        }}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testFixture.quantity
                                )}  
                            </TableCell>   
                            <TableCell align="right">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputProjectAssociation}
                                        onChange={(e) => setInputProjectAssociation(e.target.value)}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testFixture.projectAssociation
                                )}  
                            </TableCell>   
                            <TableCell align="right">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputMisc}
                                        onChange={(e) => setInputMisc(e.target.value)}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testFixture.misc
                                )}  
                            </TableCell>  
                            <TableCell align="center">
                                <ButtonGroup size="small">
                                    <IconButton size="small" onClick={() => handleOpenSettings(index, testFixture)} disableRipple>
                                        {selectedRow === null && (
                                            <SettingsIcon/>
                                        )}
                                    </IconButton>    
                                    {selectedRow != null && (
                                        <>  
                                            <IconButton size="small" onClick={handleCloseSettings}>
                                                <CancelIcon/>
                                            </IconButton>
                                            <IconButton size="small" onClick={() => {
                                                handleUpdateItem(testFixture)
                                            }}>
                                                <SaveIcon/>
                                            </IconButton>                                                                               
                                            <IconButton size="small" onClick={() => {
                                                handleOpenDeleteDialog(testFixture.id || null)
                                            }}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </>
                                    )}                      
                                </ButtonGroup>                            
                            </TableCell>                                                             
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}