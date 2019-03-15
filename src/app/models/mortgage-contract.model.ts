import { Contribution } from './contribution.model';
import { Mortgage } from './mortgage.model';

export interface MortgageContract {
    mortgage: Mortgage;
    payment: Contribution;
    id: number;
}
