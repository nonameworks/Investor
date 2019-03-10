import { Portfolio } from './portfolio.model';
import { Contribution } from './contribution.model';

export class Year {
    age: number;
    portfolio: Portfolio;
    rrsp: Contribution;
    tfsa: Contribution;
    taxable: Contribution;
}