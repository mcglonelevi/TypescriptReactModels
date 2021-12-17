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
        property: {
            city: '',
            state: '',
            zip: '',
            address: '',
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
        property: {
            city: '',
            state: '',
            zip: '',
            address: '',
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
