import React from "react";
import { SignOutLog } from "../../../types";
import { useGetAllSignOutLogs } from "../../../hooks";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export const SignOutLogTable: React.FC = () => {
    const signOutLogs:SignOutLog[] = useGetAllSignOutLogs();
    return(
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Test Item</TableCell>
                        <TableCell align="right">Quantity Signed Out</TableCell>
                        <TableCell align="right">Signed Out By</TableCell>
                        <TableCell align="right">Date Signed Out</TableCell>
                        <TableCell align="right">Date Returned</TableCell>                        
                    </TableRow>
                </TableHead>
                <TableBody>
                    {signOutLogs.map((signOutLog) => (
                        <TableRow key={signOutLog.id}>
                            <TableCell component="th" scope="row">{signOutLog.testSample || signOutLog.testFixture || "?"}</TableCell>    
                            <TableCell align="right">{signOutLog.signedOutQuantity}</TableCell>   
                            <TableCell align="right">{signOutLog.signedOutBy}</TableCell>   
                            <TableCell align="right">{signOutLog.dateSignedOut}</TableCell>  
                            <TableCell align="right">{signOutLog.dateReturned}</TableCell>                                                             
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}