export interface FlipClockCardConfig {
  title: string;
  time: TimeOptions;
  timezones: string[] | Timezone[];
  date: DateOptions;
}

export interface TimeOptions {
  face: string;
  showSeconds: boolean;
}

export interface DateOptions {
  format: Intl.DateTimeFormatOptions;
  hidden: boolean;
  locale: string;
}

export interface Timezone {
  id: string;
  title: string;
}
