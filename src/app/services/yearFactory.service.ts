import { Year } from '../models/year.model';

export class YearFactory {
    public static CreateYear(riskProfile: string, previousYear: Year): Year {
        return {
            age: previousYear.age + 1,
            portfolio: null,
            rrsp: { contribution: previousYear.rrsp.contribution, period: previousYear.rrsp.period },
            tfsa: { contribution: previousYear.tfsa.contribution, period: previousYear.tfsa.period },
            taxable: { contribution: previousYear.taxable.contribution, period: previousYear.taxable.period },
          };
      }
}
