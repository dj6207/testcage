import { TestCageItem } from "../enums";

export type TestSample = {
    id?: number;
    name: string;
    quantity: number;
    model?: string;
    serialNumber: string;
    projectAssociation?: string;
    productEquivalence?: string;
    misc?: string;
}

export type TestFixture = {
    id?: number;
    name: string;
    quantity: number;
    projectAssociation?: string;
    misc?: string;
}

export type SignOutLog = {
    id?: number;
    testSampleId?:number;
    testFixtureId?:number;
    testSample?:string;
    testFixture?:string;
    signedOutQuantity: number;
    signedOutBy: string;
    dateSignedOut?: string;
    dateReturned?: string;
}

export type ShortCutHandler = 
    () => void;

export type SnackBarState = {
    open: boolean;
    message: string;
}

export type RouteItem = {
    path: string;
    label: string;
}

export type NavBarProps = {
    routes: RouteItem[];
}

export type SignOutFormProps = {
    signOutItem: TestSample | TestFixture | null;
}

export type ReturnFormProps = {
    signOutLog: SignOutLog | null;
}