import React, { useState } from "react";
import { SignOutForm } from "../features";
import { TestCageItem } from "../enums";
import { TestFixture, TestSample } from "../types";
import { useGetAllTestFixtures, useGetAllTestSamples } from "../hooks";
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, List, ListItemButton, ListItemText, Paper, TextField } from "@mui/material";

export const SignOutPage: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [testCageItemType, setTestCageItemType] = useState<TestCageItem>(TestCageItem.TestSample);
    const [openSignOutDialog, setOpenSignOutDialog] = useState<boolean>(false);
    const [selectedTestItem, setSelectedTestItem] = useState<TestSample | TestFixture | null>(null);

    const testSamples:TestSample[] = useGetAllTestSamples();
    const testFixtures:TestFixture[] = useGetAllTestFixtures();

    const filterTestSamples = (unfilteredTestSamples:TestSample) => {
        return unfilteredTestSamples.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.serialNumber.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.model?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.projectAssociation?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestSamples.productEquivalence?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    }

    const filterTestFixtures = (unfilteredTestFixture:TestFixture):boolean | undefined => {
        return unfilteredTestFixture.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        unfilteredTestFixture.projectAssociation?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    }

    const filteredTestSamples:TestSample[] = testSamples.filter(filterTestSamples);
    const filteredTestFixtures:TestFixture[] = testFixtures.filter(filterTestFixtures);


    const handleOpenSignOutDialog = (testItem:TestSample | TestFixture):void => {
        setSelectedTestItem(testItem);
        setOpenSignOutDialog(true);
    }

    const handleCloseSignOutDialog = ():void => {
        setOpenSignOutDialog(false);
        setSelectedTestItem(null);
    }

    return (
        <>
            <Dialog open={openSignOutDialog} onClose={handleCloseSignOutDialog}>
                <DialogActions sx={{backgroundColor: '#ddd'}}>
                    <DialogContent sx={{marginLeft: '10px', padding: '0px'}}>
                        <DialogContentText>
                            Item Sign Out {selectedTestItem?.name}
                        </DialogContentText>
                    </DialogContent>      
                    <Button variant="contained" onClick={handleCloseSignOutDialog}>Close</Button>              
                </DialogActions>
                <DialogContent>
                    <SignOutForm signOutItem={selectedTestItem}/>
                </DialogContent>
            </Dialog>
            <Paper>
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
                            <div key={testSample.id}>
                                {testSample.quantity != 0 && (
                                    <ListItemButton onClick={() => handleOpenSignOutDialog(testSample)}>
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
                                )}
                            </div>
                        ))}
                    </List>
                ) : (
                    <List sx={{border: '1px solid #ddd', borderRadius: '4px'}}>
                        {filteredTestFixtures.map(testFixture => (
                            <div key={testFixture.id}>
                                {testFixture.quantity !== 0 && (
                                    <ListItemButton onClick={() => handleOpenSignOutDialog(testFixture)}>
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
                                )}
                            </div>
                        ))}
                    </List>
                )}
            </Paper>
        </>
    );
}