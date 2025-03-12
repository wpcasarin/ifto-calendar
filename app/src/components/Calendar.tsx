import { DayPicker } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';
import data from '../data.json';
import { EventInfo } from './EventInfo';
import { useState } from 'react';
import { getDatesBetween } from '../utils';

const addToCalendar = (startDate: string, endDate: string | null, message: string) => {
  startDate = startDate.replace(/-/g, '');

  if (endDate) {
    const date = new Date(`${endDate}T00:00:00`);
    date.setDate(date.getDate() + 1);
    endDate = date.toISOString().split('T')[0].replace(/-/g, '');
  } else {
    endDate = startDate;
  }

  const sanitizedMessage = encodeURIComponent(message);
  const sanitizedTitle = encodeURIComponent('Calendário IFTO');

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${sanitizedTitle}&dates=${startDate}/${endDate}&details=${sanitizedMessage}`;

  window.open(url, '_blank', 'noopener,noreferrer');
};

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
    <div className="mx-auto flex grow flex-col items-center gap-2 px-4">
      <DayPicker
        footer={
          <ul className="text-xs">
            <li className="flex items-center gap-1">
              <div className="bg-dl size-2 rounded-full"></div>
              <span>Dia letivo</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="bg-dnl size-2 rounded-full"></div>
              <span>Dia não letivo</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="bg-feriado size-2 rounded-full"></div>
              <span>Feriado</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="bg-pf size-2 rounded-full"></div>
              <span>Ponto facultativo</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="bg-ef size-2 rounded-full"></div>
              <span>Exames finais</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="bg-fs size-2 rounded-full"></div>
              <span>Fim de semana</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="bg-ferias size-2 rounded-full"></div>
              <span>Férias</span>
            </li>
          </ul>
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

      {currentEvents !== undefined && currentEvents.length > 0 ? <EventInfo events={currentEvents} /> : null}

      <div className="bg-base-100 border-base-300 collapse-arrow collapse mb-4 rounded-lg border">
        <input type="checkbox" defaultChecked={false} />
        <div className="collapse-title font-semibold">Agenda do mês</div>

        <div className="collapse-content text-sm">
          <table className="table">
            <tbody>
              {events?.map((e) => {
                const start = new Date(`${e.start_date}T00:00:00`);
                if (month.getMonth() === start.getMonth()) {
                  return (
                    <tr className="grid grid-cols-9 text-xs">
                      <td className="col-span-2 self-center px-0">
                        <span>{e.start_date.split('-')[2]}</span>
                        {e.end_date && <span> à {e.end_date.split('-')[2]}</span>}
                      </td>
                      <td className="col-span-6 self-center px-0">{e.description}</td>
                      <td className="col-span-1 self-center justify-self-end px-0">
                        <button
                          onClick={() => addToCalendar(e.start_date, e.end_date, e.description)}
                          className="btn btn-xs btn-soft btn-primary btn-square"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="size-4"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </button>
                      </td>
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
