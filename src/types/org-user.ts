export interface Company {
    id: number;
    name: string;
    // Add other fields if you know them, or leave as is
}

export type proxyUser = {
    id: number;
    name: string;
    mobile: string | null;
    email: string;
    client_id: number;
    meta: any; // Adjust if meta has a specific structure
    created_at: Date;
    updated_at: Date;
    is_block: boolean;
    feature_configuration_id: number;
    is_password_verified: number;
    c_companies: Company[];
    currentCompany: Company;
};
export type member = any;