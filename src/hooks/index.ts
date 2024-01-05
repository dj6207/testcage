import { useEffect, useState } from "react"
import { SignOutLog, TestFixture, TestSample } from "../types";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetAllTestSamples = ():TestSample[] => {
    const [testSamples, setTestSamples] = useState<TestSample[]>([]);
    useEffect(() => {
        // Listener used for data persistence will refetch data if recieve message from backend stating database is updated
        // Even emitter can be found in /src-tauri/database/sqlite_connector.rs 
        const listener = listen("database-update", () => {
            // DEBUG
            console.log("Database updated re-fetching data");
            invoke<TestSample[]>("plugin:sqlite_connector|get_all_test_samples")
                .then((res) => setTestSamples(res))
                .catch((err) => console.log(err));
        })
        invoke<TestSample[]>("plugin:sqlite_connector|get_all_test_samples")
            .then((res) => setTestSamples(res))
            .catch((err) => console.log(err));
        // Unsubscribte to listener when component is unmounted
        return () => {
            // DEBUG
            console.log("useGetAllTestSamples event listener unmounted");
            listener.then((fn) => fn())
        }
    }, []);
    return testSamples;
}

export const useGetAllTestFixtures = ():TestFixture[] => {
    const [testFixtures, setTestFixtures] = useState<TestFixture[]>([]);
    useEffect(() => {
        const listener = listen("database-update", () => {
            // DEBUG
            console.log("Database updated re-fetching data");
            invoke<TestFixture[]>("plugin:sqlite_connector|get_all_test_fixtures")
                .then((res) => setTestFixtures(res))
                .catch((err) => console.log(err));
        })
        invoke<TestFixture[]>("plugin:sqlite_connector|get_all_test_fixtures")
            .then((res) => setTestFixtures(res))
            .catch((err) => console.log(err));
        return () => {
            // DEBUG
            console.log("useGetAllTestFixtures event listener unmounted");
            listener.then((fn) => fn())
        }
    }, []);
    return testFixtures;
}

export const useGetAllSignOutLogs = ():SignOutLog[] => {
    const [signOutLogs, setSignOutLogs] = useState<SignOutLog[]>([]);
    useEffect(() => {
        const listener = listen("database-update", () => {
            // DEBUG
            console.log("Database updated re-fetching data");            
            invoke<SignOutLog[]>("plugin:sqlite_connector|get_all_sign_out_logs")
                .then((res) => setSignOutLogs(res))
                .catch((err) => console.log(err));
        })
        invoke<SignOutLog[]>("plugin:sqlite_connector|get_all_sign_out_logs")
            .then((res) => setSignOutLogs(res))
            .catch((err) => console.log(err));
        return () => {
            // DEBUG
            console.log("useGetAllSignOutLogs event listener unmounted");            
            listener.then((fn) => fn())
        }
    }, []);
    return signOutLogs;
}