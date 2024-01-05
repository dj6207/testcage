export type TestSample = {
    id?: number;
    name: string;
    quantity: number;
    model?: string;
    serialNumber: string;
    projectAssociation?: string;
    productEquivalence?: string;
    misc?: string;
    signedOutQuantity?: number;
    signedOutBy?: string;
    dateSignedOut?: string;
    dateReturned?: string;
}

export type TestFixture = {
    id?: number;
    name: string;
    quantity: number;
    projectAssociation?: string;
    misc?: string;
    signedOutQuantity?: number;
    signedOutBy?: string;
    dateSignedOut?: string;
    dateReturned?: string;
}

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