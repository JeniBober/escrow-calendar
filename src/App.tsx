import { useReducer, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from './components/Calendar';

const SET_FIELD = 'SET_FIELD';
const SET_ADDRESS = 'SET_ADDRESS';
const SET_FIELD_RANGE = 'SET_FIELD_RANGE';
const ADD_CUSTOM_FIELD = 'ADD_CUSTOM_FIELD';
const SET_CUSTOM_FIELD = 'SET_CUSTOM_FIELD';

type FieldValue = Date | { startDate: Date | null; endDate: Date | null } | null;
type Field = { name: string; value: FieldValue };
type CustomField = {
  name: string;
  value: Date | null;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// type State = {
//   address: {
//     name: string;
//     value: string;
//   };
//   fields: {
//     acceptance: Field;
//     inspection: Field;
//     loanAppraisal: Field;
//     [key: string]: Field | FieldValue | FieldValue;
//   };
//   customFields: CustomField[];
// };
type Action =
  | { type: typeof SET_FIELD; field: string; value: Date }
  | { type: typeof ADD_CUSTOM_FIELD }
  | { type: typeof SET_CUSTOM_FIELD; index: number; field: string; value: Date | null | string }
  | { type: typeof SET_ADDRESS; value: string }
  | { type: typeof SET_FIELD_RANGE; field: string; startDate: Date | null; endDate: Date | null };

const initialState = {
  address: {
    name: 'Address',
    value: '',
  },
  fields: {
    acceptance: {
      name: 'Acceptance',
      value: null,
    },
    inspection: {
      name: 'Inspection',
      value: {
        startDate: null,
        endDate: null,
      },
    },
    loanAppraisal: {
      name: 'Loan & Appraisal',
      value: {
        startDate: null,
        endDate: null,
      },
    },
  },
  customFields: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: any, action: Action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            name: state.fields[action.field].name,
            value: action.value,
          },
        },
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: {
          ...state.address,
          value: action.value,
        },
      };
    case 'SET_FIELD_RANGE':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            value: {
              startDate: action.startDate,
              endDate: action.endDate,
            },
          },
        },
      };
    case 'ADD_CUSTOM_FIELD':
      return { ...state, customFields: [...state.customFields, { name: '', value: null }] };
    case 'SET_CUSTOM_FIELD':
      return {
        ...state,
        customFields: state.customFields?.map((field: Field, index: number) => {
          if (index === action.index) {
            return { ...field, [action.field]: action.value };
          }
          return field;
        }),
      };
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (date: Date, field: string) => {
    dispatch({ type: SET_FIELD, field, value: date });
  };

  const handleDateRangeChange = (
    dates: Date | [Date | null, Date | null] | null,
    field: string
  ) => {
    if (Array.isArray(dates)) {
      dispatch({
        type: 'SET_FIELD_RANGE',
        field,
        startDate: dates[0],
        endDate: dates[1],
      });
    }
  };

  const handleCustomFieldChange = (index: number, field: string, value: Date | null | string) => {
    dispatch({
      type: 'SET_CUSTOM_FIELD',
      index,
      field,
      value,
    });
  };

  return (
    <>
      <header>Escrow Calendar Generator</header>
      <main>
        {showCalendar ? (
          <Calendar state={state} setShowCalendar={setShowCalendar} />
        ) : (
          <>
            <form className="flex flex-col">
              <label>
                Address:
                <input
                  type="text"
                  value={state.address.value}
                  onChange={(e) => dispatch({ type: SET_ADDRESS, value: e.target.value })}
                />
              </label>
              <label>
                Acceptance:
                <DatePicker
                  showIcon
                  placeholderText="Select a date"
                  selected={state.fields.acceptance.value}
                  onChange={(date: Date) => handleDateChange(date, 'acceptance')}
                />
              </label>
              <label>
                Inspection:
                <DatePicker
                  showIcon
                  placeholderText="Select a date range"
                  selectsRange
                  startDate={state.fields.inspection.value.startDate}
                  endDate={state.fields.inspection.value.endDate}
                  onChange={(dates: Date | [Date | null, Date | null] | null) =>
                    handleDateRangeChange(dates, 'inspection')
                  }
                />
              </label>
              <label>
                Loan & Appraisal:
                <DatePicker
                  showIcon
                  placeholderText="Select a date range"
                  selectsRange
                  startDate={state.fields.loanAppraisal.value.startDate}
                  endDate={state.fields.loanAppraisal.value.endDate}
                  onChange={(dates: Date | [Date | null, Date | null] | null) =>
                    handleDateRangeChange(dates, 'loanAppraisal')
                  }
                />
              </label>
              {state.customFields.map((field: CustomField, index: number) => (
                <div key={index}>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                    />
                  </label>
                  <label>
                    Date:
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => handleCustomFieldChange(index, 'value', date)}
                    />
                  </label>
                </div>
              ))}
              <button type="button" onClick={() => dispatch({ type: 'ADD_CUSTOM_FIELD' })}>
                Add Custom Field
              </button>
            </form>
            <button type="button" onClick={() => setShowCalendar(true)}>
              Generate Calendar
            </button>
          </>
        )}
      </main>
      {<pre>{JSON.stringify(state, null, 2)}</pre>}
      <footer>Escrow Calendar Generator</footer>
    </>
  );
}

export default App;
