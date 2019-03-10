import { Mortgage } from '../models/mortgage.model';

export class MortgageFactory {
    static CreateMortgage(mortgage: Mortgage): Mortgage {
        const ret: Mortgage = {
            active: mortgage.ammortization > 1,
            term: mortgage.term === 1 ? mortgage.originalTerm : mortgage.term - 1,
            ammortization: mortgage.ammortization - 1,
            originalAmmortization: mortgage.originalAmmortization,
            originalTerm: mortgage.originalTerm,
            rate: mortgage.rate,
            principal: MortgageFactory.GetRemainingPrincipal(mortgage)
        };

        return ret;
    }
    static GetRemainingPrincipal(mortgage: Mortgage): number {
        return mortgage.principal;
    }

}
