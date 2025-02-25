export const getDatesBetween = (startDate: Date, endDate: Date | null): Date[] => {
  if (!endDate) {
    return [new Date(startDate)];
  }

  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  currentDate.setHours(0, 0, 0, 0);

  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setHours(0, 0, 0, 0);

  while (currentDate <= normalizedEndDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
