export type TestSample = {
    id?: number;
    name: string;
    quantity: number;
    model: string;
    serialNumber: number;
    projectAssociation: string;
    productEquivalence: string;
    misc: string;
}

export type TestFixture = {
    id?: number;
    name: string;
    quantity: number;
    projectAssociation: string;
    misc: string;
}

export type RouteItem = {
    path: string;
    label: string;
}

export type NavBarProps = {
    routes: RouteItem[];
}