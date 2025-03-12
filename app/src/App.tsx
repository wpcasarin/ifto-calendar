import { Calendar } from './components/Calendar';

export const App = () => {
  return (
    <main>
      <header className="mt-2 px-4 font-bold">Calendário Superior IFTO</header>
      <div className="divider my-2"></div>
      <Calendar />
    </main>
  );
};
