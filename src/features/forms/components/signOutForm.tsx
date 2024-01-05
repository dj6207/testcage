import { Box, Button, ButtonGroup, Dialog, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import React, { useState } from "react";
import { TestFixture, TestSample } from "../../../types";
import { useGetAllTestFixtures, useGetAllTestSamples } from "../../../hooks";
import { TestCageItem } from "../../../enums";

export const SignOutForm: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [testCageItemType, setTestCageItemType] = useState<TestCageItem>(TestCageItem.TestSample);
    const [selectedTestItem, setSelectedTestItem] = useState<TestSample | TestFixture | null>();

    const testSamples:TestSample[] = useGetAllTestSamples();
    const testFixtures:TestFixture[] = useGetAllTestFixtures();

    const filterTestSamples = (unfilteredTestSamples:TestSample) => {
        return unfilteredTestSamples.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.serialNumber.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.model?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.projectAssociation?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.productEquivalence?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    }

    const filterTestFixtures = (unfilteredTestFixture:TestFixture) => {
        return unfilteredTestFixture.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestFixture.projectAssociation?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    }


    const filteredTestSamples = testSamples.filter(filterTestSamples);
    const filteredTestFixtures = testFixtures.filter(filterTestFixtures);

    const handleSignOut = ():void => {

    }

    return (
        <Box component="form" onSubmit={handleSignOut}>
            <ButtonGroup size="small" fullWidth variant="contained" sx={{marginTop: '10px', marginBottom: '10px'}}>
                <Button onClick={() => setTestCageItemType(TestCageItem.TestSample)}>
                    Test Samples
                </Button>
                <Button onClick={() => setTestCageItemType(TestCageItem.TestFixture)}>
                    Test Fixtures
                </Button>
            </ButtonGroup>
            <TextField 
                label="Search Item" 
                margin="normal"
                variant="outlined" 
                fullWidth 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
            />
            {testCageItemType === TestCageItem.TestSample ? (
                <List sx={{border: '1px solid #ddd', borderRadius: '4px'}}>
                    {filteredTestSamples.map(testSample => (
                        <ListItemButton key={testSample.id} onClick={() => setSelectedTestItem(testSample)}>
                            <ListItemText 
                                primary={testSample.name} 
                                secondary={
                                    `| 
                                    Quantity: ${testSample.quantity} | 
                                    Serial Number: ${testSample.serialNumber} | 
                                    Model: ${testSample.model} | 
                                    Project Association: ${testSample.projectAssociation} | 
                                    Product Equivalence: ${testSample.productEquivalence} 
                                    |`
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>
            ) : (
                <List sx={{border: '1px solid #ddd', borderRadius: '4px'}}>
                    {filteredTestFixtures.map(testFixture => (
                        <ListItemButton key={testFixture.id} onClick={() => setSelectedTestItem(testFixture)}>
                            <ListItemText 
                                primary={testFixture.name} 
                                secondary={
                                    `| 
                                    Quantity: ${testFixture.quantity} | 
                                    Project Association: ${testFixture.projectAssociation} 
                                    |`
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    );
}