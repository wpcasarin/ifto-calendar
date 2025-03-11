import { DayPicker } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';
import data from '../data.json';
import { EventInfo } from './EventInfo';
import { useState } from 'react';
import { getDatesBetween } from '../utils';

// const getCalendarUrl = (date: Date, message: string) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const stringDate = `${year}${month}${day}`;
//   const sanitizedMessage = encodeURIComponent(message);

//   const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=IFTO&dates=${stringDate}/${stringDate}&details=${sanitizedMessage}`;
//   window.open(url, '_blank', 'noopener,noreferrer');
// };

export type EventType = {
  date: Date;
  description: string;
};

export const Calendar = () => {
  const [month, setMonth] = useState(new Date());
  const [currentEvents, setCurrentEvents] = useState<EventType[] | undefined>();

  const colors = data.flatMap((item) => item.colored_days);
  const events = data.flatMap((item) => item.events);

  const fsDate = colors.filter((v) => v.type === 'final_de_semana').map((v) => new Date(v.day + 'T00:00:00'));
  const efDate = colors.filter((v) => v.type === 'exames_finais').map((v) => new Date(v.day + 'T00:00:00'));
  const feriadosDate = colors.filter((v) => v.type === 'feriado').map((v) => new Date(v.day + 'T00:00:00'));
  const feriasDate = colors.filter((v) => v.type === 'ferias').map((v) => new Date(v.day + 'T00:00:00'));
  const dnlDate = colors.filter((v) => v.type === 'dia_nao_letivo').map((v) => new Date(v.day + 'T00:00:00'));
  const dlDate = colors.filter((v) => v.type === 'dia_letivo').map((v) => new Date(v.day + 'T00:00:00'));
  const ppaDate = colors
    .filter((v) => v.type === 'planejamento_pedagogico')
    .map((v) => new Date(v.day + 'T00:00:00'));
  const pfDate = colors
    .filter((v) => v.type === 'ponto_facultativo')
    .map((v) => new Date(v.day + 'T00:00:00'));

  const handleEvents = (day: Date | undefined) => {
    if (day === undefined) return;

    const eventsList: EventType[] = events.flatMap((e) => {
      const start = new Date(`${e.start_date}T00:00:00`);
      const end = e.end_date ? new Date(`${e.end_date}T00:00:00`) : null;
      return getDatesBetween(start, end).map((date) => ({
        date,
        description: e.description,
      }));
    });
    const eventList: EventType[] = eventsList.filter((v) => v.date.getTime() === day.getTime());
    setCurrentEvents(eventList);
  };

  return (
    <div className="mx-auto flex flex-col items-center gap-2 px-4">
      <DayPicker
        footer={
          currentEvents !== undefined && currentEvents.length > 0 ? (
            <EventInfo events={currentEvents} />
          ) : null
        }
        month={month}
        onMonthChange={setMonth}
        startMonth={new Date(2025, 0)}
        endMonth={new Date(2026, 1)}
        locale={ptBR}
        mode="single"
        selected={undefined}
        onSelect={(date) => handleEvents(date)}
        modifiers={{
          fs: fsDate,
          ef: efDate,
          feriados: feriadosDate,
          ferias: feriasDate,
          pf: pfDate,
          dnl: dnlDate,
          ppa: ppaDate,
          dl: dlDate,
        }}
        modifiersClassNames={{
          fs: 'bg-fs',
          ef: 'bg-ef',
          feriados: 'bg-error',
          ferias: 'bg-ferias',
          pf: 'bg-pf',
          dnl: 'bg-dnl',
          ppa: 'bg-ppa',
          dl: 'bg-dl font-bold',
        }}
        className="react-day-picker"
      />
      <div className="bg-base-100 border-base-300 collapse border">
        <input type="checkbox" defaultChecked={false} />
        <div className="collapse-title font-semibold">Lista de eventos</div>

        <div className="collapse-content text-sm">
          <table className="table">
            <tbody>
              {events?.map((e) => {
                const start = new Date(`${e.start_date}T00:00:00`);
                if (month.getMonth() === start.getMonth()) {
                  return (
                    <tr className="text-xs">
                      <td className="pl-0">{e.start_date}</td>
                      <td className="pr-0">{e.description}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
