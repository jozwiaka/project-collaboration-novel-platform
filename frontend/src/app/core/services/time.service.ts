import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  formatDate(date: string | Date): string {
    date = new Date(date);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      date.getDay()
    ];
    const dayOfMonth = date.getDate();
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][date.getMonth()];
    const year = date.getFullYear();
    const period = hours >= 12 ? 'pm' : 'am';

    const formattedHours = hours % 12 || 12;

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return `${formattedHours}:${formattedMinutes} ${period} Today`;
    } else {
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        date.getDay()
      ];
      return `${formattedHours}:${formattedMinutes} ${period} ${dayOfWeek}, ${dayOfMonth}${this.getOrdinalSuffix(
        dayOfMonth
      )} ${month} ${year}`;
    }
  }

  getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  calculateElapsedTime(date: string | Date): string {
    date = new Date(date);

    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - date.getTime();

    const secondsDifference = Math.floor(timeDifference / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2629746;
    const secondsInYear = 31536000;
    if (secondsDifference >= secondsInYear) {
      const years = Math.floor(secondsDifference / secondsInYear);
      return years === 1 ? 'a year' : `${years} years`;
    } else if (secondsDifference >= secondsInMonth) {
      const months = Math.floor(secondsDifference / secondsInMonth);
      return months === 1 ? 'a month' : `${months} months`;
    } else if (secondsDifference >= secondsInDay) {
      const days = Math.floor(secondsDifference / secondsInDay);
      return days === 1 ? 'a day' : `${days} days`;
    } else if (secondsDifference >= secondsInHour) {
      const hours = Math.floor(secondsDifference / secondsInHour);
      return hours === 1 ? 'an hour' : `${hours} hours`;
    } else if (secondsDifference >= secondsInMinute) {
      const minutes = Math.floor(secondsDifference / secondsInMinute);
      return minutes === 1 ? 'a minute' : `${minutes} minutes`;
    } else {
      return 'a few seconds';
    }
  }
}
