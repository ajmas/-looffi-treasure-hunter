import { DateTime } from 'luxon';

function ensureDateTime (date: unknown): DateTime | undefined {
  if (date && typeof date === 'string') {
    return DateTime.fromISO(date);
  } else if (date instanceof Date) {
    return DateTime.fromJSDate(date);
  } else if (date instanceof DateTime && (date as DateTime).isValid) {
    return date as DateTime;
  }

  return undefined;
}

function ensureJsDate (date: string | Date | undefined): Date | undefined {
  if (date && typeof date === 'string') {
    return DateTime.fromISO(date).toJSDate() as Date;
  }
  return date as Date;
}

export { ensureDateTime, ensureJsDate };
