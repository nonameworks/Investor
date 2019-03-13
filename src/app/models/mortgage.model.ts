import { Contribution } from './contribution.model';

export interface Mortgage {
    ammortization: number;
    term: number;
    rate: number;
    principal: number;
    originalAmmortization: number;
    originalTerm: number;
    originalPrincipal: number;
    open: boolean;
    started: boolean;
}
