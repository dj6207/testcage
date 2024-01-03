import { Box, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, FormLabel, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TestCageItem } from "../../../enums";
import { TestFixture, TestSample } from "../../../types";
import { invoke } from '@tauri-apps/api/tauri'

export const AddItemForm: React.FC = () => {
    const [testCageItemType, setTestCageItemType] = useState<TestCageItem>(TestCageItem.TestSample);
    const [inputName, setInputName] = useState<string>("");
    const [inputQuantity, setInputQuantity] = useState<string>("");
    const [inputProjectAssociation, setInputProjectAssociation] = useState<string>("");
    const [inputMisc, setInputMisc] = useState<string>("");

    const [inputModel, setInputModel] = useState<string>("");
    const [inputSerialNumber, setInputSerialNumber] = useState<string>("");
    const [inputProductionEquivalence, setInputProductionEquivalence] = useState<string>("");
    const handleAddItem = () => {

    }

    const handleChangeTestCageItemType = (e: SelectChangeEvent) => {
        setTestCageItemType(e.target.value as TestCageItem);
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box component="form" onSubmit={handleAddItem} sx={{ mt: 1 }}>
            <FormLabel sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>New {testCageItemType}</FormLabel>
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
                            onChange={(e) => {
                                const serialNumberValue = e.target.value;
                                if (serialNumberValue == '' || /^[0-9]*$/.test(serialNumberValue)) {
                                    setInputSerialNumber(serialNumberValue)
                                }
                            }}
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

const addTestSample = (newTestSample:TestSample) => {
    const [response, setResponse] = useState<boolean>(false);
    useEffect(() => {
        invoke<boolean>("plugin::sqlite_connector|add_test_sample", { newTestSample })
            .then((res) => setResponse(res))
            .catch((err) => console.log(err));
    }, []);
    return response
}

const addTestFixture = (newTestFixture:TestFixture) => {
    const [response, setResponse] = useState<boolean>(false);
    useEffect(() => {
        invoke<boolean>("plugin::sqlite_connector|add_test_fixture", { newTestFixture })
            .then((res) => setResponse(res))
            .catch((err) => console.log(err));
    }, []);
    return response
}