import { useReducer, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from './components/Calendar';

const SET_FIELD = 'SET_FIELD';
const SET_ADDRESS = 'SET_ADDRESS';
const SET_FIELD_RANGE = 'SET_FIELD_RANGE';
const ADD_CUSTOM_FIELD = 'ADD_CUSTOM_FIELD';
const SET_CUSTOM_FIELD = 'SET_CUSTOM_FIELD';

type FieldValue = string | { startDate: string; endDate: string };
type Field = { name: string; value: FieldValue };
type State = {
  address: Field;
  fields: { [key: string]: Field };
  customFields: Field[];
};
type Action =
  | { type: typeof SET_FIELD; field: string; value: FieldValue }
  | { type: typeof ADD_CUSTOM_FIELD }
  | { type: typeof SET_CUSTOM_FIELD; index: number; field: string; value: string }
  | { type: typeof SET_ADDRESS; value: string }
  | { type: typeof SET_FIELD_RANGE; field: string; startDate: string; endDate: string };

const initialState = {
  address: {
    name: 'Address',
    value: '',
  },
  fields: {
    acceptance: {
      name: 'Acceptance',
      value: '',
    },
    inspection: {
      name: 'Inspection',
      value: {
        startDate: '',
        endDate: '',
      },
    },
    loanAppraisal: {
      name: 'Loan & Appraisal',
      value: {
        startDate: '',
        endDate: '',
      },
    },
  },
  customFields: [],
};

function reducer(state: any, action: Action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
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
      return { ...state, customFields: [...state.customFields, { name: '', date: '' }] };
    case 'SET_CUSTOM_FIELD':
      return {
        ...state,
        customFields: state.customFields.map((field: Field, index: number) => {
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

  const handleDateChange = (date: any, field: string) => {
    dispatch({ type: 'SET_FIELD', field, value: date });
  };

  const handleDateRangeChange = (dates: any, field: string) => {
    dispatch({
      type: 'SET_FIELD_RANGE',
      field,
      startDate: dates[0],
      endDate: dates[1],
    });
  };

  const handleCustomFieldChange = (index: number, field: string, value: any) => {
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
                  onChange={(dates: Date[]) => handleDateRangeChange(dates, 'inspection')}
                />
              </label>
              {state.customFields.map((field: any, index: number) => (
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
                      selected={field.date}
                      onChange={(date: Date) => handleCustomFieldChange(index, 'date', date)}
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
