export interface HealthLog {
    id: string;
    title: string;
    dateStarted: number | null | undefined;
    dateEnded: number | null | undefined;
    lastEdit: number | null;
    ongoing: boolean;
    symptoms: string[];
    treatments: Treatment[];
    whatHelped: Treatment[];
    notes: string;
    images: string[];
    isPinned: boolean;
}

export interface Treatment {
    treatmentID: string;
    treatmentName: string;
    amount: string;
    amountUnit: string;
    frequencyValue: string;
    frequencyUnit: string;
    durationValue: string;
    durationUnit: string;
}

export interface Settings {
    dateFormat: string;
    muteSounds: boolean;
    gridView: boolean;
}

export interface User {
    id: string;
    email: string;
    journal: HealthLog[];
}