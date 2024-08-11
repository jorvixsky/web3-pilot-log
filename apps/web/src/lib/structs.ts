export interface ValidationResponse {
    logbookOwner: `0x${string}`;
    logbookId: string;
    entryCid: string;
    validator: `0x${string}`;
    isValidated: boolean;
}