import { Model } from "./model";
import * as yup from 'yup';

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

export type MortgageApplication = {
    borrower: Applicant;
    coBorrower: Applicant;
};

const borrowerSchema = yup.object({
    firstName: yup.string().required().label('First Name'),
    lastName: yup.string().required().label('Last Name'),
    married: yup.boolean().required().label('married'),
    incomeSources: yup.array().required().min(1).label('Income Sources').of(yup.object({
        name: yup.string().required().label('Employer Name'),
        yearlyAmount: yup.number().required().min(1).label('Salary'),
    })),
}).required();

export class MortgageApplicationRecord extends Model {
    static validations = yup.object({
        borrower: borrowerSchema,
        coBorrower: borrowerSchema,
    }).required();

    borrower!: Applicant;
    coBorrower!: Applicant;

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
