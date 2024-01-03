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
import React, { useState } from "react";
import { TestSample } from "../../../types";

export const TestSampleTable: React.FC = () => {
    const [testSamples, setTestSamples] = useState<TestSample[]>([])
    console.log("render")
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
                        <>
                            {testSample.id !== undefined && (
                                <TableRow key={testSample.id}>
                                    {Object.entries(testSample).map(([key, value]) => (
                                        <TableCell key={key}>
                                            {value}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )}
                        </>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}