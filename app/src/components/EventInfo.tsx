import { EventType } from './Calendar';

export type EventInfoType = {
  events: EventType[];
};

export const EventInfo: React.FC<EventInfoType> = (props) => {
  return (
    <>
      <div role="alert" className="alert w-full">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info h-6 w-6 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg> */}

        <ul>
          <li className="font-bold">{props.events[0].date.toLocaleDateString('pt-BR')}</li>
          {props.events.map((v, i) => {
            return (
              <li key={i} className="text-xs">
                <span>- </span>
                {v.description}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
