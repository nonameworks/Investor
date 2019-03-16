import { Mortgage } from './mortgage.model';

export interface Portfolio {
    taxableContributions: number;
    rrspRoom: number;
    tfsaRoom: number;
    age: number;
    rrspValue: number;
    tfsaValue: number;
    taxableValue: number;
    income: number;
}
