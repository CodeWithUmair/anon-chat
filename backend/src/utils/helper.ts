export const getNextExecutionDate = (recurrence: 'weekly' | 'monthly',isTestMode=false): Date => {
  const now = new Date();

  
  if (isTestMode) {
    const offsetMs =
      recurrence === "weekly" ? 2 * 60 * 1000 /* 2 min */ : 10 * 60 * 1000; /* 10 min */
    return new Date(now.getTime() + offsetMs);
  }

  let nextDate: Date;

  if (recurrence === 'weekly') {
    const dayOfWeek = now.getUTCDay(); // use UTC day
    const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
    const nextMonday = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilNextMonday,
      0, 0, 0, 0 // midnight UTC
    ));
    nextDate = nextMonday;
  } else if (recurrence === 'monthly') {
    const nextMonth = now.getUTCMonth() + 1;
    const nextMonthStart = new Date(Date.UTC(
      now.getUTCFullYear(),
      nextMonth,
      1,
      0, 0, 0, 0 // midnight UTC
    ));
    nextDate = nextMonthStart;
  } else {
    throw new Error("Invalid recurrence type");
  }

  return nextDate;
};
