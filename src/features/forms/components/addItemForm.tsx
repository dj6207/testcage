import { Box, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, FormLabel, Button } from "@mui/material";
import React, { useState } from "react";
import { TestCageItem } from "../../../enums";
import { TestFixture, TestSample } from "../../../types";
import { invoke } from '@tauri-apps/api/tauri'
import { AppDispatch } from "../../../store";
import { useAppDispatch } from "../../../hooks";
import { showSnackBar } from "../../../slices/snackBarSlice";

export const AddItemForm: React.FC = () => {
    const dispatch: AppDispatch = useAppDispatch();

    const [testCageItemType, setTestCageItemType] = useState<TestCageItem>(TestCageItem.TestSample);

    const [inputName, setInputName] = useState<string>("");
    const [inputQuantity, setInputQuantity] = useState<string>("");
    const [inputProjectAssociation, setInputProjectAssociation] = useState<string>("");
    const [inputMisc, setInputMisc] = useState<string>("");
    const [inputModel, setInputModel] = useState<string>("");
    const [inputSerialNumber, setInputSerialNumber] = useState<string>("");
    const [inputProductionEquivalence, setInputProductionEquivalence] = useState<string>("");

    const handleAddItem = (e:React.FocusEvent<HTMLFormElement>):void => {
        e.preventDefault();
        if (testCageItemType === TestCageItem.TestFixture) {
            const newTestFixture:TestFixture = {
                name: inputName,
                quantity: parseInt(inputQuantity) || 1,
                projectAssociation: inputProjectAssociation,
                misc: inputMisc,
            };
            addTestFixture(newTestFixture);
        } else {
            const newTestSample:TestSample = {
                name: inputName,
                quantity: parseInt(inputQuantity) || 1,
                model: inputModel,
                serialNumber: inputSerialNumber,
                projectAssociation: inputProjectAssociation,
                productEquivalence: inputProductionEquivalence,
                misc: inputMisc,
            };
            addTestSample(newTestSample);
        }
    }

    const addTestFixture = (item:TestFixture):void => {
        invoke<number>("plugin:sqlite_connector|add_test_fixture", { item: item })
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err);
                dispatch(showSnackBar("Test Fixture Already Exist"));
            });
    }
    
    const addTestSample = (item:TestSample):void => {
        invoke<number>("plugin:sqlite_connector|add_test_sample", { item: item })
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err);
                dispatch(showSnackBar("Test Sample Already Exist"));
            });
    }

    const handleChangeTestCageItemType = (e: SelectChangeEvent):void => {
        setTestCageItemType(e.target.value as TestCageItem);
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box component="form" onSubmit={handleAddItem} sx={{ mt: 1 }}>
                <FormControl fullWidth>
                    <InputLabel>Item Type</InputLabel>
                    <Select
                        value={testCageItemType}
                        label="Item Type"
                        onChange={handleChangeTestCageItemType}
                    >
                        {Object.values(TestCageItem).map((itemType) => (
                            <MenuItem key={itemType} value={itemType}>
                                {itemType}
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label='Item Name'
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                />
                <TextField
                    margin="normal"
                    type="text"
                    required
                    fullWidth
                    label='Quantity'
                    value={inputQuantity}
                    onChange={(e) => {
                        const quantityValue = e.target.value;
                        if (quantityValue == '' || /^[0-9]*$/.test(quantityValue)) {
                            setInputQuantity(quantityValue)
                        }
                    }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label='Project Association'
                    value={inputProjectAssociation}
                    onChange={(e) => setInputProjectAssociation(e.target.value)}
                />
                {testCageItemType === TestCageItem.TestSample && (
                    <>
                        <TextField
                            margin="normal"
                            fullWidth
                            label='Model'
                            value={inputModel}
                            onChange={(e) => setInputModel(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label='Serial Number'
                            value={inputSerialNumber}
                            onChange={(e) => setInputSerialNumber(e.target.value)}
                        />    
                        <TextField
                            margin="normal"
                            fullWidth
                            label='Production Equivalence'
                            value={inputProductionEquivalence}
                            onChange={(e) => setInputProductionEquivalence(e.target.value)}
                        />                    
                    </>
                )}
                <TextField
                    margin="normal"
                    fullWidth
                    label='Misc'
                    value={inputMisc}
                    onChange={(e) => setInputMisc(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                >
                    Add {testCageItemType}
                </Button>
                </Box>
        </Container>
    );
}