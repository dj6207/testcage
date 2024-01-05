import { Box } from "@mui/material";
import React, { useState } from "react";
import { TestFixture, TestSample } from "../../../types";
import { useGetAllTestFixtures, useGetAllTestSamples } from "../../../hooks";

export const SignOutForm: React.FC = () => {
    const [selectedTestSample, setSelectedTestSample] = useState<TestSample | null>();

    const testSamples:TestSample[] = useGetAllTestSamples();
    const testFixture:TestFixture[] = useGetAllTestFixtures();

    const handleSignOut = ():void => {

    }

    return (
        <Box component="form" onSubmit={handleSignOut}>

        </Box>
    );
}