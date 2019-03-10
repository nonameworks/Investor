import { Portfolio } from './../models/portfolio.model';
import { ContributionService } from './contribution.service';
import { Year } from '../models/year.model';
import { currentId } from 'async_hooks';

export class YearFactory {
    private static annualReturns = [
        0.248035814115241,
        -0.141607741351603,
        0.0004750998992316,
        0.300198275984249,
        -0.061795257673081,
        0.206318381095397,
        0.0552803056064919,
        0.0287451680809399,
        0.0672235884319883,
        0.172346896941617,
        -0.180119736213686,
        0.0820368429686053,
        -0.0408245342112797,
        0.290355300686772,
        -0.02494557468521,
        0.124162300595746,
        0.259081472445508,
        0.132076130108291,
        -0.033239428707756,
        0.290024769777862,
        0.0617913905784925,
        -0.142091982716412,
        -0.138692130372438,
        0.239524845484575,
        0.122008927851315,
        0.226569926833097,
        0.141871524642337,
        0.0703005616464854,
        -0.353760861322622,
        0.312134753064189,
        0.1347058330816,
        -0.116426767610502,
        0.0277998048787355,
        0.0835043367125905,
        0.0742214435358638,
        -0.111174863306696,
        0.183195832363015,
        0.0548129613640138,
        -0.116601080242822,
        0.129364070165608
    ];

    private static used: number[] = [];

    public static CreateYear(riskProfile: string, income: number, previousYear: Year): Year {
        let curReturn = YearFactory.GetReturn();

        switch (riskProfile) {
            case 'Aggressive': break;
            case 'Assertive': curReturn = curReturn * .9; break;
            case 'Balanced': curReturn = curReturn * .8; break;
            case 'Cautious': curReturn = curReturn * .7; break;
            case 'Conservative': curReturn = curReturn * .6; break;
        }

        const newPortfolio = YearFactory.CreateNewPortfolio(previousYear);
        newPortfolio.rrspRoom = newPortfolio.rrspRoom + Math.min(income * .18, 26500 + (230 * YearFactory.used.length));
        newPortfolio.tfsaRoom = newPortfolio.tfsaRoom + 6000;

        newPortfolio.rrspValue = newPortfolio.rrspValue * curReturn;
        newPortfolio.tfsaValue = newPortfolio.tfsaValue * curReturn;

        return {
            age: previousYear.age + 1,
            portfolio: newPortfolio,
            rrsp: { contribution: previousYear.rrsp.contribution, period: previousYear.rrsp.period },
            tfsa: { contribution: previousYear.tfsa.contribution, period: previousYear.tfsa.period },
            taxable: { contribution: previousYear.taxable.contribution, period: previousYear.taxable.period },
          };
      }

    private static CreateNewPortfolio(previousYear: Year): Portfolio {
        const newPortfolio = previousYear.portfolio;

        const rrspTotal = ContributionService.GetTotal(previousYear.rrsp);
        newPortfolio.rrspValue = newPortfolio.rrspValue + rrspTotal;
        const rrspRollover = Math.max(0, rrspTotal - previousYear.portfolio.rrspRoom);

        const tfsaTotal = ContributionService.GetTotal(previousYear.tfsa);
        newPortfolio.tfsaValue = newPortfolio.tfsaValue + tfsaTotal;
        const tfsaRollover = Math.max(0, tfsaTotal - previousYear.portfolio.tfsaRoom);

        if (rrspRollover > 0 && tfsaRollover > 0) {
            YearFactory.SetMaxRollover(newPortfolio, rrspRollover, tfsaRollover);
            return newPortfolio;
        }

        if (rrspRollover > 0 && tfsaRollover === 0) {
            if (rrspRollover > previousYear.portfolio.tfsaRoom - tfsaTotal ) {
                YearFactory.SetMaxRollover(newPortfolio, rrspRollover, tfsaRollover);
                return newPortfolio;
            } else {
                newPortfolio.rrspValue = newPortfolio.rrspValue + newPortfolio.rrspRoom;
                newPortfolio.tfsaValue = newPortfolio.tfsaValue + rrspRollover;
                newPortfolio.tfsaRoom =  newPortfolio.tfsaRoom - tfsaTotal - rrspRollover;
                return newPortfolio;
            }
        }

        if (rrspRollover === 0 && tfsaRollover > 0) {
            if (tfsaRollover > previousYear.portfolio.rrspRoom - rrspTotal ) {
                YearFactory.SetMaxRollover(newPortfolio, rrspRollover, tfsaRollover);
                return newPortfolio;
            } else {
                newPortfolio.tfsaValue = newPortfolio.tfsaValue + newPortfolio.tfsaRoom;
                newPortfolio.rrspValue = newPortfolio.rrspValue + tfsaRollover;
                newPortfolio.rrspRoom =  newPortfolio.rrspRoom - rrspTotal - tfsaRollover;
            }
        }

    }

    private static SetMaxRollover(newPortfolio: Portfolio, rrspRollover: number, tfsaRollover: number) {
        newPortfolio.rrspValue = newPortfolio.rrspValue + newPortfolio.rrspRoom;
        newPortfolio.tfsaValue = newPortfolio.tfsaValue + newPortfolio.tfsaRoom;
        newPortfolio.tfsaRoom = 6000;
        newPortfolio.taxableValue = newPortfolio.taxableValue + rrspRollover + tfsaRollover;
    }

    private static GetReturn(): number {
        let curReturn = YearFactory.GenerateRandomNumber();
        while (YearFactory.used.includes(curReturn)) {
            curReturn = YearFactory.GenerateRandomNumber();
        }

        YearFactory.used.push(curReturn);
        return curReturn;
    }

    private static GenerateRandomNumber(): number {
        return Math.floor(Math.random() * (YearFactory.annualReturns.length + 1));
      }
}
