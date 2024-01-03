import { Box, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";
import { TestCageItem } from "../../../enums";

export const AddItemForm: React.FC = () => {
    const [testCageItemType, setTestCageItemType] = useState<TestCageItem>(TestCageItem.TestSample);
    const [inputName, setInputName] = useState<string>("");
    const [inputQuantity, setInputQuantity] = useState<string>("");

    const handleAddItem = () => {

    }

    const handleChangeTestCageItemType = (e: SelectChangeEvent) => {
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
                </Box>
        </Container>
    );
}