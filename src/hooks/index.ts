import { useEffect, useState } from "react"
import { TestFixture, TestSample } from "../types";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";

export const useGetAllTestSamples = () => {
    const [testSamples, setTestSamples] = useState<TestSample[]>([]);
    useEffect(() => {
        // Listener used for data persistence will refetch data if recieve message from backend stating database is updated
        // Even emitter can be found in /src-tauri/database/sqlite_connector.rs 
        const listener = listen("database-update", () => {
            // DEBUG
            console.log("Database updated re-fetching data");
            invoke<TestSample[]>("plugin:sqlite_connector|get_all_test_samples")
                .then((res) => setTestSamples(res))
                .catch((err) => console.log(err))
        })
        invoke<TestSample[]>("plugin:sqlite_connector|get_all_test_samples")
            .then((res) => setTestSamples(res))
            .catch((err) => console.log(err))
        // Unsubscribte to listener when component is unmounted
        return () => {
            // DEBUG
            console.log("useGetAllTestSamples event listener unmounted");
            listener.then((fn) => fn())
        }
    }, []);
    return testSamples
}

export const useGetAllTestFixtures = () => {
    const [testFixtures, setTestFixtures] = useState<TestFixture[]>([]);
    useEffect(() => {
        const listener = listen("database-update", () => {
            // DEBUG
            console.log("Database updated re-fetching data");
            invoke<TestFixture[]>("plugin:sqlite_connector|get_all_test_fixtures")
                .then((res) => setTestFixtures(res))
                .catch((err) => console.log(err))
        })
        invoke<TestFixture[]>("plugin:sqlite_connector|get_all_test_fixtures")
            .then((res) => setTestFixtures(res))
            .catch((err) => console.log(err))
        return () => {
            // DEBUG
            console.log("useGetAllTestFixtures event listener unmounted");
            listener.then((fn) => fn())
        }
    }, []);
    return testFixtures
}