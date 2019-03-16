import { Contribution } from './../models/contribution.model';
import { Portfolio } from '../models/portfolio.model';

export class ContributionService {
    public static GetTotal(contribution: Contribution): number {
        const numContributions = this.GetNumberOfContributions(contribution.period);
        if (numContributions == null) { return 0; }
        return contribution.contribution * numContributions + (contribution.lump || 0);
    }

    public static GetNumberOfContributions(period: string) {
        switch (period) {
            case 'Annually': return 1;
            case 'Monthly': return 12;
            case 'Bi-weekly': return 26;
            case 'Semi-monthly': return 24;
            case 'Weekly': return 52;
        }
    }

  static GetTotalValue(portfolio: Portfolio): number {
    let sum = 0;
    sum += portfolio.rrspValue;
    sum += portfolio.tfsaValue;
    sum += portfolio.taxableValue;
    return sum;
  }
}
