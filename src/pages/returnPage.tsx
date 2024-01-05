import React, { useState } from "react";
import { ReturnForm } from "../features";
import { SignOutLog } from "../types";
import { useGetAllSignOutLogs } from "../hooks";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, List, ListItemButton, ListItemText, Paper, TextField } from "@mui/material";

export const ReturnPage: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [openReturnDialog, setOpenReturnDialog] = useState<boolean>(false);
    const [selectedSignOutLog, setSelectedSignOutLog] = useState<SignOutLog | null>(null);

    const signOutLogs:SignOutLog[] = useGetAllSignOutLogs();

    const filterSignOutLogs = (unfilteredSignOutLog:SignOutLog) => {
        return unfilteredSignOutLog.testSample?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            unfilteredSignOutLog.testFixture?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            unfilteredSignOutLog.signedOutBy.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    }

    const filteredSignOutLogs:SignOutLog[] = signOutLogs.filter(filterSignOutLogs);

    const handleOpenReturnDialog = (signOutLog:SignOutLog):void => {
        setSelectedSignOutLog(signOutLog);
        setOpenReturnDialog(true);
    }

    const handleCloseReturnDialog = ():void => {
        setOpenReturnDialog(false);
        setSelectedSignOutLog(null);
    }

    return (
        <>
            <Dialog open={openReturnDialog} onClose={handleCloseReturnDialog}>
                <DialogActions sx={{backgroundColor: '#ddd'}}>
                    <DialogContent sx={{marginLeft: '10px', padding: '0px'}}>
                        <DialogContentText>
                            Returning {selectedSignOutLog?.testSample || selectedSignOutLog?.testFixture || "item"}
                        </DialogContentText>
                    </DialogContent>
                    <Button variant="contained" onClick={handleCloseReturnDialog}>Close</Button>
                </DialogActions>
                <DialogContent>
                    <ReturnForm signOutLog={selectedSignOutLog}/>
                </DialogContent>
            </Dialog>
            <Paper>
                <TextField 
                    label="Search Item" 
                    margin="normal"
                    variant="outlined" 
                    fullWidth 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                />        
                <List sx={{border: '1px solid #ddd', borderRadius: '4px'}}>
                    {filteredSignOutLogs.map(signOutLog => (
                        <ListItemButton key={signOutLog.id} onClick={() => handleOpenReturnDialog(signOutLog)}>
                            <ListItemText 
                                primary={signOutLog.testSample || signOutLog.testFixture || "N/A"} 
                                secondary={
                                    `| 
                                    Signed Out By: ${signOutLog.signedOutBy} | 
                                    Quantity: ${signOutLog.signedOutQuantity} | 
                                    Date Signed Out: ${signOutLog.dateSignedOut} 
                                    |`
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>                      
            </Paper>
        </>
    );
}