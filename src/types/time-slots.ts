import { TimeSlot } from "@/types/schedule";

// 150-minute lecture blocks with 10-minute breaks (except custom Friday)
export const MONDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "10:30", label: "08:00 - 10:30" },
  { start: "10:40", end: "13:10", label: "10:40 - 13:10" },
  { start: "13:20", end: "15:50", label: "13:20 - 15:50" },
  { start: "16:00", end: "18:30", label: "16:00 - 18:30" },
  { start: "18:40", end: "21:10", label: "18:40 - 21:10" }
];

export const TUESDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "10:30", label: "08:00 - 10:30" },
  { start: "10:40", end: "13:10", label: "10:40 - 13:10" },
  { start: "13:20", end: "15:50", label: "13:20 - 15:50" },
  { start: "16:00", end: "18:30", label: "16:00 - 18:30" },
  { start: "18:40", end: "21:10", label: "18:40 - 21:10" }
];

export const WEDNESDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "10:30", label: "08:00 - 10:30" },
  { start: "10:40", end: "13:10", label: "10:40 - 13:10" },
  { start: "13:20", end: "15:50", label: "13:20 - 15:50" },
  { start: "16:00", end: "18:30", label: "16:00 - 18:30" },
  { start: "18:40", end: "21:10", label: "18:40 - 21:10" }
];

export const THURSDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "10:30", label: "08:00 - 10:30" },
  { start: "10:40", end: "13:10", label: "10:40 - 13:10" },
  { start: "13:20", end: "15:50", label: "13:20 - 15:50" },
  { start: "16:00", end: "18:30", label: "16:00 - 18:30" },
  { start: "18:40", end: "21:10", label: "18:40 - 21:10" }
];

// Friday starts later; keep evening option
export const FRIDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "13:00", end: "15:30", label: "13:00 - 15:30" },
  { start: "15:40", end: "18:10", label: "15:40 - 18:10" },
  { start: "19:00", end: "21:30", label: "19:00 - 21:30" }
];

export const SATURDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "10:30", label: "08:00 - 10:30" },
  { start: "10:40", end: "13:10", label: "10:40 - 13:10" },
  { start: "13:20", end: "15:50", label: "13:20 - 15:50" },
  { start: "16:00", end: "18:30", label: "16:00 - 18:30" },
  { start: "18:40", end: "21:10", label: "18:40 - 21:10" }
];

export const SUNDAY_TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "10:30", label: "08:00 - 10:30" },
  { start: "10:40", end: "13:10", label: "10:40 - 13:10" },
  { start: "13:20", end: "15:50", label: "13:20 - 15:50" },
  { start: "16:00", end: "18:30", label: "16:00 - 18:30" },
  { start: "18:40", end: "21:10", label: "18:40 - 21:10" }
];

export const DAY_TIME_SLOTS = {
  monday: MONDAY_TIME_SLOTS,
  tuesday: TUESDAY_TIME_SLOTS,
  wednesday: WEDNESDAY_TIME_SLOTS,
  thursday: THURSDAY_TIME_SLOTS,
  friday: FRIDAY_TIME_SLOTS,
  saturday: SATURDAY_TIME_SLOTS,
  sunday: SUNDAY_TIME_SLOTS
} as const;
