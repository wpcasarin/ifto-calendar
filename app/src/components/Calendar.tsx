import { DayPicker } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';

export const Calendar = () => {
  return (
    <div className="">
      <DayPicker
        className="react-day-picker"
        locale={ptBR}
        mode="single"
        selected={undefined}
        onSelect={(date) => console.log(date)}
        modifiers={{}}
        modifiersClassNames={{}}
      />
    </div>
  );
};
