import { Mortgage } from './mortgage.model';

export interface Portfolio {
    rrspRoom: number;
    tfsaRoom: number;
    age: number;
    rrspValue: number;
    tfsaValue: number;
    taxableValue: number;
    income: number;
    mortgage: Mortgage;
    pension: number;
}
