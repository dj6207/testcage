export const formatTime = (date:Date):string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const isTestSample = (obj: Object):boolean => {
    return 'model' in  obj && 'serialNumber' in obj && 'productEquivalence' in obj;
}

export const isTestFixture = (obj: Object):boolean => {
    return !('model' in  obj && 'serialNumber' in obj && 'productEquivalence' in obj);
}