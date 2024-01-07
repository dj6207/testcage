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
    ButtonGroup,
} from "@mui/material";
import React, { useState } from "react";
import { TestSample } from "../../../types";
import { useAppDispatch, useAppSelector, useGetAllTestSamples } from "../../../hooks";
import { invoke } from "@tauri-apps/api/tauri";
import { AppDispatch } from "../../../store";
import { showSnackBar } from "../../../slices/snackBarSlice";

import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export const TestSampleTable: React.FC = () => {
    const dispatch:AppDispatch = useAppDispatch();
    const editStatus = useAppSelector((state) => state.appSettings.editMode);

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedTestSample, setSelectedTestSample] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const [inputName, setInputName] = useState<string>("");
    const [inputQuantity, setInputQuantity] = useState<string>("");
    const [inputProjectAssociation, setInputProjectAssociation] = useState<string>("");
    const [inputMisc, setInputMisc] = useState<string>("");
    const [inputModel, setInputModel] = useState<string>("");
    const [inputSerialNumber, setInputSerialNumber] = useState<string>("");
    const [inputProductionEquivalence, setInputProductionEquivalence] = useState<string>("");

    const testSamples:TestSample[] = useGetAllTestSamples();

    const handleOpenDeleteDialog = (testSampleId:number | null):void => {
        setSelectedTestSample(testSampleId);
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = ():void => {
        setOpenDeleteDialog(false);
        setSelectedTestSample(null);
    }

    const handleOpenSettings = (row: number, testSample:TestSample):void => {
        if (selectedRow === null) {
            setSelectedRow(row);

            setInputName(testSample.name);
            setInputQuantity(testSample.quantity.toString());
            setInputProjectAssociation(testSample.projectAssociation || '');
            setInputMisc(testSample.misc || '');
            setInputModel(testSample.model || '');
            setInputSerialNumber(testSample.serialNumber);
            setInputProductionEquivalence(testSample.productEquivalence || '');
        }
    }

    const handleCloseSettings = ():void => {
        setSelectedRow(null);

        setInputName('');
        setInputQuantity('');
        setInputProjectAssociation('');
        setInputMisc('');
        setInputModel('');
        setInputSerialNumber('');
        setInputProductionEquivalence('');
    }

    const handleDeleteItem = ():void => {
        handleCloseDeleteDialog();
        handleCloseSettings();
        if (selectedTestSample != null) {
            const id = selectedTestSample;
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
            console.log("selectedTestSample is null");
            dispatch(showSnackBar("Error deleting Test Sample"));
        }
    }

    const handleUpdateItem = (testSample:TestSample):void => {
        handleCloseSettings();
        if (testSample.id != null) {
            const updatedTestSample:TestSample = {
                id: testSample.id,
                name: inputName,
                quantity: parseInt(inputQuantity) || testSample.quantity,
                model: inputModel,
                serialNumber: inputSerialNumber,
                projectAssociation: inputProjectAssociation,
                productEquivalence: inputProductionEquivalence,
                misc: inputMisc,
            }
            updateTestSample(updatedTestSample);
        } else {
            console.log("testSample is null");
            dispatch(showSnackBar("Error Updating Test Sample"));
        }
    }

    const updateTestSample = (item:TestSample):void => {
        invoke<number>("plugin:sqlite_connector|update_test_sample_by_id", {item: item})
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err);
                dispatch(showSnackBar("Error Updating Test Sample"))
            })
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
                        {editStatus && (
                            <TableCell align="center">
                                <IconButton disabled={true} size="small">
                                    <SettingsIcon/>
                                </IconButton>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testSamples.map((testSample, index) => (
                        <TableRow key={testSample.id} >
                            <TableCell component="th" scope="row">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputName}
                                        onChange={(e) => setInputName(e.target.value)}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testSample.name
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
                                    testSample.quantity
                                )}                                
                            </TableCell>                               
                            <TableCell align="right">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputModel}
                                        onChange={(e) => setInputModel(e.target.value)}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testSample.model
                                )}                                
                            </TableCell>   
                            <TableCell align="right">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputSerialNumber}
                                        onChange={(e) => setInputSerialNumber(e.target.value)}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testSample.serialNumber
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
                                    testSample.projectAssociation
                                )}                                
                            </TableCell> 
                            <TableCell align="right">
                                {selectedRow === index ? (
                                    <TextField
                                        size="small"
                                        value={inputProductionEquivalence}
                                        onChange={(e) => setInputProductionEquivalence(e.target.value)}
                                        sx={{ maxWidth: '200px'}}
                                    />
                                    ) : (
                                    testSample.productEquivalence
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
                                    testSample.misc
                                )}                                  
                            </TableCell>    
                            {editStatus && (
                                <TableCell align="center">
                                    <ButtonGroup size="small">
                                        <IconButton size="small" onClick={() => handleOpenSettings(index, testSample)} disableRipple>
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
                                                    handleUpdateItem(testSample)
                                                }}>
                                                    <SaveIcon/>
                                                </IconButton>                                                                               
                                                <IconButton size="small" onClick={() => {
                                                    handleOpenDeleteDialog(testSample.id || null)
                                                }}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </>
                                        )}                      
                                    </ButtonGroup>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}