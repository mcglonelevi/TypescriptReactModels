import React from 'react';
import { MortgageApplicationRecord } from './models/mortgage-application';
import { useImmer, Updater } from 'use-immer';

const initialApplication = new MortgageApplicationRecord({
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

interface BorrowerFormProps {
  app: MortgageApplicationRecord;
  heading: string;
  nestedProperty: 'borrower'|'coBorrower',
  setApp: Updater<MortgageApplicationRecord>;
};

function BorrowerForm({ app, setApp, heading, nestedProperty }: BorrowerFormProps) {  
  return (
    <div>
      <h1>{heading}</h1>
      <p>First Name</p>
      <input
        type="text"
        value={app[nestedProperty].firstName}
        onChange={(e) => setApp((draft) => { draft[nestedProperty].firstName = e.target.value; })}
      />
      <p>Last Name</p>
      <input
        type="text"
        value={app[nestedProperty].lastName}
        onChange={(e) => setApp((draft) => { draft[nestedProperty].lastName = e.target.value; })}
      />
      <p>Married</p>
      <select
        value={app[nestedProperty].married ? 'Married' : 'Single'}
        onChange={(e) => setApp((draft) => { draft[nestedProperty].married = e.target.value === 'Married'; })}
      >
        <option value="Married">Married</option>
        <option value="Single">Single</option>
      </select>
      <h2>Income Sources: (Monthly Income ${app.getMonthlyIncome()})</h2>
      {
        app[nestedProperty].incomeSources.map((incomeSource, index) => {
          return (
            <React.Fragment key={index}>
              <p>Name</p>
              <input
                type="text"
                value={incomeSource.name}
                onChange={(e) => setApp((draft) => { draft[nestedProperty].incomeSources[index].name = e.target.value; })}
              />
              <p>Yearly Salary</p>
              <input
                type="text"
                value={incomeSource.yearlyAmount}
                // Quick and dirty type-casting...
                onChange={(e) => setApp((draft) => { draft[nestedProperty].incomeSources[index].yearlyAmount = Number(e.target.value); })}
              />
              <button
                type="button"
                onClick={() => {
                  setApp((draft) => { draft[nestedProperty].incomeSources.splice(index, 1); } );
                }}
              >
                Remove Income Source
              </button>
            </React.Fragment>
          );
        })
      }
      <div>
        <button
          type="button"
          onClick={() => {
            setApp((draft) => { draft[nestedProperty].incomeSources.push({ name: '', yearlyAmount: 0 })});
          }}
        >
          Add Income Source
        </button>
      </div>
    </div>
  );
}

function App() {
  const [app, setApp] = useImmer(initialApplication);

  return (
    <>
      <BorrowerForm
        app={app}
        setApp={setApp}
        heading='Borrower'
        nestedProperty='borrower'
      />
      <BorrowerForm
        app={app}
        setApp={setApp}
        heading='Co-Borrower'
        nestedProperty='coBorrower'
      />
    </>
  );
}

export default App;
