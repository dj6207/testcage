import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField
} from "@mui/material";
import React from "react";
import { TestSample } from "../../../types";
import { useGetAllTestSamples } from "../../../hooks";

export const TestSampleTable: React.FC = () => {
    const testSamples:TestSample[] = useGetAllTestSamples();
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Serial Number</TableCell>
                        <TableCell>Project Association</TableCell>
                        <TableCell>Production Equivalence</TableCell>
                        <TableCell>Misc</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testSamples.map((testSample) => (
                        <TableRow key={testSample.id}>
                            <TableCell>{testSample.name}</TableCell>    
                            <TableCell>{testSample.quantity}</TableCell>   
                            <TableCell>{testSample.model}</TableCell> 
                            <TableCell>{testSample.serialNumber}</TableCell> 
                            <TableCell>{testSample.projectAssociation}</TableCell>   
                            <TableCell>{testSample.productEquivalence}</TableCell> 
                            <TableCell>{testSample.misc}</TableCell>                                   
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}