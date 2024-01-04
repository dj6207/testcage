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
import { TestFixture } from "../../../types";
import { useGetAllTestFixtures } from "../../../hooks";

export const TestFixtureTable: React.FC = () => {
    // const [testFixtures, setTestFixtures] = useState<TestFixture[]>([])
    const testFixtures:TestFixture[] = useGetAllTestFixtures(); 
    console.log("render")
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Project Association</TableCell>
                        <TableCell>Misc</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testFixtures.map((testFixture) => (
                        <TableRow key={testFixture.id}>
                            <TableCell>{testFixture.name}</TableCell>    
                            <TableCell>{testFixture.quantity}</TableCell>   
                            <TableCell>{testFixture.projectAssociation}</TableCell>   
                            <TableCell>{testFixture.misc}</TableCell>                                   
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}