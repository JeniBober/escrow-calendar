export default function Calendar({ state, setShowCalendar }) {
  return (
    <div>
      <button type="button" onClick={() => setShowCalendar(false)}>
        Edit
      </button>
      <p>calendar</p>
    </div>
  );
}
