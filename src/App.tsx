import React from 'react';
import { MortgageApplicationRecord } from './models/mortgage-application';
import { useImmer, Updater } from 'use-immer';
import { useState } from 'react';

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
});

interface BorrowerFormProps {
  app: MortgageApplicationRecord;
  heading: string;
  nestedProperty: 'borrower'|'coBorrower',
  setApp: Updater<MortgageApplicationRecord>;
  errors: Map<string, string[]>|null;
};

function BorrowerForm({ app, setApp, heading, nestedProperty, errors }: BorrowerFormProps) {  
  return (
    <div>
      <h1>{heading}</h1>
      <p>First Name</p>
      <input
        type="text"
        value={app[nestedProperty].firstName}
        onChange={(e) => setApp((draft) => { draft[nestedProperty].firstName = e.target.value; })}
      />
      <ErrorDisplay errors={errors} property={`${nestedProperty}.firstName`} />
      <p>Last Name</p>
      <input
        type="text"
        value={app[nestedProperty].lastName}
        onChange={(e) => setApp((draft) => { draft[nestedProperty].lastName = e.target.value; })}
      />
      <ErrorDisplay errors={errors} property={`${nestedProperty}.lastName`} />
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
              <ErrorDisplay errors={errors} property={`${nestedProperty}.incomeSources[${index}].name`} />
              <p>Yearly Salary</p>
              <input
                type="text"
                value={incomeSource.yearlyAmount}
                // Quick and dirty type-casting...
                onChange={(e) => setApp((draft) => { draft[nestedProperty].incomeSources[index].yearlyAmount = Number(e.target.value); })}
              />
              <ErrorDisplay errors={errors} property={`${nestedProperty}.incomeSources[${index}].yearlyAmount`} />
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
        <ErrorDisplay errors={errors} property={`${nestedProperty}.incomeSources`} />
      </div>
    </div>
  );
}

interface ErrorDisplayProps {
  property: string;
  errors: Map<string, string[]>|null;
};

function ErrorDisplay({property, errors}: ErrorDisplayProps) {
  if (!errors || !errors.get(property)) {
    return null;
  }
  return (
    <div>
      <p style={{ color: 'red' }}>{errors.get(property)}</p>
    </div>
  );
}

function App() {
  const [app, setApp] = useImmer(initialApplication);
  const [errors, setErrors] = useState<Map<string, string[]>|null>(null);

  console.log(errors);

  return (
    <>
      <BorrowerForm
        app={app}
        setApp={setApp}
        heading='Borrower'
        nestedProperty='borrower'
        errors={errors}
      />
      <BorrowerForm
        app={app}
        setApp={setApp}
        heading='Co-Borrower'
        nestedProperty='coBorrower'
        errors={errors}
      />
      <div>
        <button type={'button'} onClick={() => {
          const validationResult = app.validate();
          if (validationResult.success) {
            setErrors(null);
          } else {
            setErrors(validationResult.errors);
          }
        }}>Submit</button>
      </div>
    </>
  );
}

export default App;
