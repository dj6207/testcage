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

export const TestFixtureTable: React.FC = () => {
    const [testFixtures, setTestFixtures] = useState<TestFixture[]>([])
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
                        <>
                            {testFixture.id !== undefined && (
                                <TableRow key={testFixture.id}>
                                    {Object.entries(testFixture).map(([key, value]) => (
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