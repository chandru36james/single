import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: any, formatStr: string = 'MMM d, yyyy'): string {
  if (!date) return 'Just now';
  
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (date instanceof Timestamp) {
    d = date.toDate();
  } else if (typeof date === 'object' && date.seconds !== undefined) {
    // Handle raw Firestore timestamp objects if they aren't instances of Timestamp
    d = new Date(date.seconds * 1000);
  } else if (typeof date === 'string' || typeof date === 'number') {
    d = new Date(date);
  } else {
    return 'Invalid Date';
  }
  
  try {
    return format(d, formatStr);
  } catch (e) {
    return 'Invalid Date';
  }
}
