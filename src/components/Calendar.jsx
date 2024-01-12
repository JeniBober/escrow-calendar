import { useCallback, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Calendar({ state, setShowCalendar }) {
  const pdfRef = useRef(null);

  const CalendarCell = ({ day, date }) => {
    return (
      <div className="border border-red w-full h-full relative flex flex-col">
        <p className="font-bold text-sm">{day}</p>
        <p
          className={`text-blue-900 font-medium ${
            date?.name === 'Inspection' ? 'bg-amber-500  mt-auto' : ''
          }`}
        >
          {date?.name}
        </p>
      </div>
    );
  };

  const datesFromState = useCallback(() => {
    const dateFields = Object.values(state.fields);
    const customDateFields = Object.values(state.customFields);

    const datesSorted = [...dateFields, ...customDateFields]
      .flatMap((field) => {
        if (field.value instanceof Date) {
          return [field];
        } else {
          return [
            { name: field.name, value: field.value.startDate },
            { name: field.name, value: field.value.endDate },
          ];
        }
      })
      .sort((a, b) => a.value - b.value);

    const firstMonth = datesSorted[0].value.getMonth();
    const datesByMonth = datesSorted.reduce(
      (acc, date) => {
        const month = date.value.getMonth();
        if (month === firstMonth) {
          acc[0].push(date);
        } else {
          acc[1].push(date);
        }
        return acc;
      },
      [[], []]
    );

    return datesByMonth;
  }, [state]);

  const renderCalendar = () => {
    const dates = datesFromState();
    const year = dates[0][0].value.getFullYear();
    const month = dates[0][0].value.getMonth();
    const firstMonthName = dates[0][0].value.toLocaleString('default', { month: 'long' });
    const secondMonthName = dates[1][0]?.value.toLocaleString('default', { month: 'long' });
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month, 0).getDate();
    let dayCount = 1;

    let calendarCells = Array.from(Array(35)).map((_, index) => {
      if (index < firstDayOfWeek || index > daysInMonth + firstDayOfWeek) {
        return <CalendarCell key={index} />;
      }

      for (const date of dates[0]) {
        if (date.value.getDate() === dayCount) {
          return <CalendarCell key={index} day={dayCount++} date={date} />;
        }
      }

      return <CalendarCell key={index} day={dayCount++} />;
    });

    return (
      <div className="flex flex-col">
        <div className="flex justify-center">
          <p className="text-2xl pb-2 font-bold">
            {firstMonthName} {year}
          </p>
        </div>
        <div className="grid grid-cols-7 w-[600px] text-center font-bold">
          <p>Sun</p>
          <p>Mon</p>
          <p>Tue</p>
          <p>Wed</p>
          <p>Thu</p>
          <p>Fri</p>
          <p>Sat</p>
        </div>
        <div className="grid grid-cols-7 grid-rows-5 border border-black w-[600px] h-[750px]">
          {calendarCells}
        </div>
      </div>
    );
  };

  function downloadPDF() {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('download.pdf');
    });
  }

  return (
    <div className="">
      <button type="button" onClick={() => setShowCalendar(false)}>
        Edit
      </button>

      <button className="" onClick={downloadPDF}>
        Download PDF
      </button>

      <pre>{JSON.stringify(datesFromState(), null, 2)}</pre>

      <div ref={pdfRef} className="flex justify-center flex-col">
        <h1 className="text-center text-3xl">{state.address.value} - Escrow Calendar</h1>
        <div className="w-full flex justify-center py-8 flex-wrap">{renderCalendar()}</div>
      </div>
    </div>
  );
}
