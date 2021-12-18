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

type MortgageApplicationSchema = yup.SchemaOf<MortgageApplication>;

export class MortgageApplicationRecord extends Model {
    static validations: MortgageApplicationSchema = yup.object({
        borrower: yup.object({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            married: yup.boolean().required(),
            incomeSources: yup.array().required().min(1).of(yup.object({
                name: yup.string().required(),
                yearlyAmount: yup.number().required(),
            })),
        }).required(),
        coBorrower: yup.object({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            married: yup.boolean().required(),
            incomeSources: yup.array().required().min(1).of(yup.object({
                name: yup.string().required(),
                yearlyAmount: yup.number().min(1).required(),
            })),
        }).required(),
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
