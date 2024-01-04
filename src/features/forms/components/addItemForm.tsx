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
                serialNumber: parseInt(inputSerialNumber) || -1,
                projectAssociation: inputProjectAssociation,
                productEquivalence: inputProductionEquivalence,
                misc: inputMisc,
            };
            addTestSample(newTestSample);
        }
    }

    const addTestFixture = (fixture:TestFixture):void => {
        // Make sure the name of the arg parssed in is the same as the name of the parameter called in the backend
        // for example the parameter "sample" in this function should be the same as the "sample" in the rust function add_test_sample
        // const addTestSample = (sample:TestSample):void => {
        //     ...
        // }
        // async fn add_test_sample<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, sample: TestSample) -> Result<i64, SerializedError>{
        //     ...
        // }
        // arg sample name === parameter sample name

        // const addTestSample = (testSample:TestSample):void => {
        //     ...
        // }
        // async fn add_test_sample<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, sample: TestSample) -> Result<i64, SerializedError>{
        //     ...
        // }
        // This wont work cause testSample != sample and will cause an error

        // Or just use the format { item: fixture } left is rust argument name and right is typescript parameter name
        invoke<number>("plugin:sqlite_connector|add_test_fixture", { item: fixture })
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err)
                dispatch(showSnackBar("Test Fixture Already Exist"));
            });
    }
    
    const addTestSample = (sample:TestSample):void => {
        invoke<number>("plugin:sqlite_connector|add_test_sample", { item: sample })
            .then((res) => console.log(res))
            .catch((err) => {
                console.log(err)
                dispatch(showSnackBar("Test Sample Already Exist"));
            });
    }

    const handleChangeTestCageItemType = (e: SelectChangeEvent):void => {
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