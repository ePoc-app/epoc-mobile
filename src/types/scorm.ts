export interface ScormApi12 {
    LMSInitialize(param: string): string;
    LMSFinish(param: string): string;
    LMSGetValue(element: string): string;
    LMSSetValue(element: string, value: string): string;
    LMSCommit(param: string): string;
}

export interface ScormApi2004 {
    Initialize(param: string): string;
    Terminate(param: string): string;
    GetValue(element: string): string;
    SetValue(element: string, value: string): string;
    Commit(param: string): string;
}

export type ScormVersion = '1.2' | '2004' | null;
