import { Contribution } from './../models/contribution.model';

export class ContributionService {
    public static GetTotal(contribution: Contribution): number {
        const numContributions = this.GetNumberOfContributions(contribution.period);
        return contribution.contribution * numContributions + (contribution.lump || 0);
    }

    private static GetNumberOfContributions(period: string) {
        switch (period) {
            case 'Annually': return 1;
            case 'Monthly': return 12;
            case 'Bi-weekly': return 26;
            case 'Semi-monthly': return 24;
            case 'Weekly': return 52;
        }
    }
}
