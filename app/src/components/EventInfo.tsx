import { EventType } from './Calendar';

export type EventInfoType = {
  events: EventType[];
};

export const EventInfo: React.FC<EventInfoType> = (props) => {
  return (
    <>
      <div role="alert" className="alert bg-base-100 w-full">
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
