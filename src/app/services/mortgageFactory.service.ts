import { Contribution } from './../models/contribution.model';
import { Mortgage } from './../models/mortgage.model';

export class MortgageFactory {
    static CreateMortgage(mortgage: Mortgage, payment: Contribution): Mortgage {
        const ret: Mortgage = {
            active: mortgage.ammortization > 1,
            term: mortgage.term === 1 ? mortgage.originalTerm : mortgage.term - 1,
            ammortization: mortgage.ammortization - 1,
            originalAmmortization: mortgage.originalAmmortization,
            originalTerm: mortgage.originalTerm,
            rate: mortgage.rate,
            originalPrincipal: mortgage.originalPrincipal,
            principal: MortgageFactory.GetRemainingPrincipal(mortgage, payment)
        };

        return ret;
    }

    static CreateNewMortgage(): Mortgage {
        return {
          active: true,
          ammortization: 24,
          term: 5,
          rate: 2.7,
          principal: 126916.10,
          originalAmmortization: 30,
          originalTerm: 5,
          originalPrincipal: 150000
        };

    }
    private static GetPayment(origRate: number, numberOfPayments: number, principal: number) {
        const r = origRate / 100;
        const rN = Math.pow(1 + r, numberOfPayments);
        const curPayment = r * rN * principal / (rN - 1);
        return curPayment;
    }

    static GetRemainingPrincipal(mortgage: Mortgage, payment: Contribution): number {
        let balance = mortgage.principal;
        let paymentsPerYear = 1;
        switch (payment.period) {
            case 'Annual': break;
            case 'Monthly': paymentsPerYear = 12; break;
            case 'Semi-monthly': paymentsPerYear = 24; break;
            case 'Bi-weekly': paymentsPerYear = 26; break;
            case 'Weekly': paymentsPerYear = 52; break;
        }

        const rate = mortgage.rate / paymentsPerYear;
        const numberOfPayments = mortgage.originalAmmortization * paymentsPerYear;
        const requiredPayment = MortgageFactory.GetPayment(rate, numberOfPayments, mortgage.originalPrincipal);
        const actualPayment = payment.contribution;

        // If there is a difference then it is applied to the principal
        const difference = actualPayment - requiredPayment;
        for (let i = 0; i < paymentsPerYear; i++) {
            balance = MortgageFactory.Interest(balance, rate) - actualPayment - difference;
        }
        return Math.max(0, Math.round(balance));
    }

    static Interest(balance: number, rate: number): number {
        return balance + balance * rate / 100;
    }

}
