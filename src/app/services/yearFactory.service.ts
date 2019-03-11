import { Mortgage } from './../models/mortgage.model';
import { Portfolio } from './../models/portfolio.model';
import { ContributionService } from './contribution.service';
import { Year } from '../models/year.model';

export class YearFactory {
    private static tsxAnnualReturns = [
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

    private static spAnnualReturns = [
        0.123917419087396,
        0.272504654787179,
        -0.0655913791554846,
        0.263143491345482,
        0.0447929214799725,
        0.0705760825179872,
        -0.0155195405131822,
        0.341281777556098,
        0.202636660689456,
        0.310081818317923,
        0.266685890653423,
        0.19526046704458,
        -0.101391846860643,
        -0.130426931573317,
        -0.233659639816933,
        0.263803999856075,
        0.0899345241050444,
        0.030010226483225,
        0.136194317577183,
        0.0354928703699547,
        -0.384694497950326,
        0.234897383524705,
        0.126352321904074,
        -1.59181629424137E-05,
        0.13292181655929,
        0.296012495855908,
        0.115414992865778,
        -0.00726599723739266,
        0.0984349582098483,
        0.187442551754512,
        -0.0659082259833011,
    ];

    private static used: number[] = [];

    public static CreateYear(riskProfile: string, income: number, previousYear: Year, newMortgage: Mortgage): Year {
        let curReturn = YearFactory.GetReturn();
        switch (riskProfile) {
            case 'Aggressive': break;
            case 'Assertive': curReturn = curReturn * .9; break;
            case 'Balanced': curReturn = curReturn * .8; break;
            case 'Cautious': curReturn = curReturn * .7; break;
            case 'Conservative': curReturn = curReturn * .6; break;
        }

        const newPortfolio = YearFactory.CreateNewPortfolio(previousYear, newMortgage);
        const rrspMaxAddition = 26500 + (230 * YearFactory.used.length);
        const rrspAddition = Math.max(Math.min(income * .18, rrspMaxAddition * 2) - newPortfolio.pension, 0);
        newPortfolio.rrspRoom = newPortfolio.rrspRoom + rrspAddition;
        newPortfolio.tfsaRoom = newPortfolio.tfsaRoom + 6000;

        newPortfolio.tfsaRoom = Math.round(newPortfolio.tfsaRoom);
        newPortfolio.rrspRoom = Math.round(newPortfolio.rrspRoom);
        newPortfolio.rrspValue = Math.round(newPortfolio.rrspValue * (1 + curReturn));
        newPortfolio.tfsaValue = Math.round(newPortfolio.tfsaValue * (1 + curReturn));

        const newYear = {
            age: previousYear.age + 1,
            ret: Math.round(curReturn * 10000) / 100,
            portfolio: newPortfolio,
            rrsp: Object.create(previousYear.rrsp),
            tfsa: Object.create(previousYear.tfsa),
            taxable: Object.create(previousYear.taxable),
            mortgage: Object.create(previousYear.mortgage),
        };

        if (newYear.portfolio.mortgage.ammortization === 0) {
            newYear.mortgage.active = false;
        }

        if (newYear.mortgage.active) {
            newYear.portfolio.mortgage.active = true;
        }

        return newYear;
    }

    private static CreateNewPortfolio(previousYear: Year, newMortgage: Mortgage): Portfolio {

        previousYear.portfolio.mortgage = newMortgage;
        const newPortfolio = Object.create(previousYear.portfolio);
        newPortfolio.age = newPortfolio.age + 1;

        const rrspTotal = ContributionService.GetTotal(previousYear.rrsp);
        const rrspRollover = Math.max(0, rrspTotal - previousYear.portfolio.rrspRoom);

        const tfsaTotal = ContributionService.GetTotal(previousYear.tfsa);
        const tfsaRollover = Math.max(0, tfsaTotal - previousYear.portfolio.tfsaRoom);

        if (rrspRollover > 0 && tfsaRollover > 0) {
            YearFactory.SetMaxRollover(newPortfolio, rrspRollover, tfsaRollover);
            return newPortfolio;
        }

        if (rrspRollover > 0 && tfsaRollover === 0) {
            if (rrspRollover > previousYear.portfolio.tfsaRoom - tfsaTotal) {
                YearFactory.SetMaxRollover(newPortfolio, rrspRollover, tfsaRollover);
                return newPortfolio;
            } else {
                newPortfolio.rrspValue = newPortfolio.rrspValue + newPortfolio.rrspRoom;
                newPortfolio.tfsaValue = newPortfolio.tfsaValue + rrspRollover;
                newPortfolio.rrspRoom = 0;
                newPortfolio.tfsaRoom = newPortfolio.tfsaRoom - tfsaTotal - rrspRollover;
                return newPortfolio;
            }
        }

        if (rrspRollover === 0 && tfsaRollover > 0) {
            if (tfsaRollover > previousYear.portfolio.rrspRoom - rrspTotal) {
                YearFactory.SetMaxRollover(newPortfolio, rrspRollover, tfsaRollover);
                return newPortfolio;
            } else {
                newPortfolio.tfsaValue = newPortfolio.tfsaValue + newPortfolio.tfsaRoom;
                newPortfolio.rrspValue = newPortfolio.rrspValue + tfsaRollover;
                newPortfolio.tfsaRoom = 0;
                newPortfolio.rrspRoom = newPortfolio.rrspRoom - rrspTotal - tfsaRollover;
                return newPortfolio;
            }
        }

        newPortfolio.rrspValue = newPortfolio.rrspValue + rrspTotal;
        newPortfolio.tfsaValue = newPortfolio.tfsaValue + tfsaTotal;
        newPortfolio.rrspRoom = newPortfolio.rrspRoom - rrspTotal;
        newPortfolio.tfsaRoom = newPortfolio.tfsaRoom - tfsaTotal;

        return newPortfolio;
    }

    private static SetMaxRollover(newPortfolio: Portfolio, rrspRollover: number, tfsaRollover: number) {
        newPortfolio.rrspValue = newPortfolio.rrspValue + newPortfolio.rrspRoom;
        newPortfolio.tfsaValue = newPortfolio.tfsaValue + newPortfolio.tfsaRoom;
        newPortfolio.tfsaRoom = 0;
        newPortfolio.rrspRoom = 0;
        newPortfolio.taxableValue = newPortfolio.taxableValue + rrspRollover + tfsaRollover;
    }

    private static GetReturn(): number {
        let curReturn = YearFactory.GenerateRandomNumber();
        while (curReturn == null || curReturn === undefined || YearFactory.used.includes(curReturn)) {
            curReturn = YearFactory.GenerateRandomNumber();
        }

        YearFactory.used.push(curReturn);
        if (YearFactory.used.length === YearFactory.spAnnualReturns.length) {
            YearFactory.used = [];
        }

        const value = YearFactory.spAnnualReturns[curReturn];
        return value;
    }

    private static GenerateRandomNumber(): number {
        return Math.floor(Math.random() * (YearFactory.spAnnualReturns.length));
    }
}
