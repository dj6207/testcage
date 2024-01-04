import { useEffect, useState } from "react"
import { TestFixture, TestSample } from "../types";
import { invoke } from "@tauri-apps/api";

export const useGetAllTestSamples = () => {
    const [testSamples, setTestSamples] = useState<TestSample[]>([]);
    useEffect(() => {
        invoke<TestSample[]>("plugin:sqlite_connector|get_all_test_samples")
            .then((res) => setTestSamples(res))
            .catch((err) => console.log(err))
    }, []);
    return testSamples
}

export const useGetAllTestFixtures = () => {
    const [testFixtures, setTestFixtures] = useState<TestFixture[]>([]);
    useEffect(() => {
        invoke<TestFixture[]>("plugin:sqlite_connector|get_all_test_fixtures")
            .then((res) => setTestFixtures(res))
            .catch((err) => console.log(err))
    }, []);
    return testFixtures
}