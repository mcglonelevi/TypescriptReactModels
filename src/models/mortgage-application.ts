import { Model } from "./model";

export interface IncomeSource {
    name: string;
    yearlyAmount: number;
};

export interface Applicant {
    firstName: string;
    lastName: string;
    married: boolean;
    incomeSources: IncomeSource[];
};

export interface Property {
    address: string;
    city: string;
    state: string;
    zip: string;
};

export interface MortgageApplication {
    borrower: Applicant;
    coBorrower: Applicant;
    property: Property;
};

export class MortgageApplicationRecord extends Model {
    borrower!: Applicant;
    coBorrower!: Applicant;
    property!: Property;

    constructor(application: MortgageApplication) {
        super();
        Object.assign(this, application);
    }

    getMonthlyIncome(): string {
        const borrowerIncome = this.borrower.incomeSources.reduce((acc, curr) => acc + curr.yearlyAmount, 0) / 12;
        const coBorrowerIncome = this.coBorrower.incomeSources.reduce((acc, curr) => acc + curr.yearlyAmount, 0) / 12;
        return (borrowerIncome + coBorrowerIncome).toFixed(2);
    }
}
