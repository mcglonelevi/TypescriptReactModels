import { MortgageApplicationRecord } from "./mortgage-application";

import produce from 'immer';

test('updating works as expected', () => {
    const application = new MortgageApplicationRecord({
        borrower: {
            firstName: '',
            lastName: '',
            married: false,
            incomeSources: [],
        },
        coBorrower: {
            firstName: '',
            lastName: '',
            married: false,
            incomeSources: [],
        },
    });

    const updatedApp = produce(application, (draft) => {
        draft.borrower.firstName = 'Levi';
    });

    expect(updatedApp.borrower.firstName).toEqual('Levi');
});

test('appending to array works as expected', () => {
    const application = new MortgageApplicationRecord({
        borrower: {
            firstName: '',
            lastName: '',
            married: false,
            incomeSources: [],
        },
        coBorrower: {
            firstName: '',
            lastName: '',
            married: false,
            incomeSources: [],
        },
    });

    const updatedApp = produce(application, (draft) => {
        draft.borrower.incomeSources.push({
            name: 'Facebook',
            yearlyAmount: 100000
        });
    });

    expect(updatedApp.borrower.incomeSources).toEqual([{
        name: 'Facebook',
        yearlyAmount: 100000
    }]);

    expect(updatedApp.getMonthlyIncome()).toEqual('8333.33');
});

test('returns error result when invalid', () => {
    const application = new MortgageApplicationRecord({
        borrower: {
            firstName: '',
            lastName: '',
            married: false,
            incomeSources: [],
        },
        coBorrower: {
            firstName: '',
            lastName: '',
            married: false,
            incomeSources: [{ name: '', yearlyAmount: -100 }],
        },
    });

    const result = application.validate();

    expect(result.success).toEqual(false);
    expect(result.errors).toBeInstanceOf(Map);
    const errors = result.errors as Map<string, string[]>;
    expect(errors.get('borrower.firstName')).toEqual(['First Name is a required field']);
});

test('returns success result when valid', () => {
    const application = new MortgageApplicationRecord({
        borrower: {
            firstName: 'Test',
            lastName: 'McGee',
            married: false,
            incomeSources: [{
                name: 'facebook',
                yearlyAmount: 1000,
            }],
        },
        coBorrower: {
            firstName: 'Test',
            lastName: 'McGee',
            married: false,
            incomeSources: [{ name: 'test', yearlyAmount: 100 }],
        },
    });

    const result = application.validate();

    expect(result.success).toEqual(true);
});
