import { useEffect, useState } from "react"
import { TestFixture, TestSample } from "../types";
import { invoke } from "@tauri-apps/api";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setTestSampleData } from "../slices/testSampleTableSlice";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetAllTestSamples = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        invoke<TestSample[]>("plugin:sqlite_connector|get_all_test_samples")
            .then((res) => dispatch(setTestSampleData(res)))
            .catch((err) => console.log(err))
    }, []);
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