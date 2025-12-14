import type { Dayjs } from "dayjs";

interface DrinkData {
  count: number;
  volume: number; // ml
  percentage: number; // %
}

export interface DetailedWidmarkResult {
  alcoholGrams: number;
  permille: number; // ‰ (C_max theoretical)
  estimatedPeakPermille?: number; // ‰ (C_peak real, if duration provided)

  // Concentrations
  permilleByVolume: number; // ‰ BAC by volume
  percentByVolume: number; // % BAC by volume
  plasma: number; // g/l
  breath: number; // mg/l

  // Time ranges
  minTime: { hours: number; minutes: number; soberDate: Dayjs };
  avgTime: { hours: number; minutes: number; soberDate: Dayjs };
  maxTime: { hours: number; minutes: number; soberDate: Dayjs };
}

export const calculateWidmark = (
  drinks: DrinkData[],
  weight: number,
  gender: "male" | "female",
  start: Dayjs,
  end: Dayjs
): DetailedWidmarkResult => {
  // Widmark factor
  const r = gender === "male" ? 0.7 : 0.6;

  // Calculate total pure alcohol in grams
  const alcoholGrams = drinks.reduce((acc, drink) => {
    return acc + drink.volume * drink.count * (drink.percentage / 100) * 0.79;
  }, 0);

  // Theoretical max concentration (C0) in ‰ by mass
  // C = A / (r * W)
  const permille = alcoholGrams / (weight * r);

  // Constants
  const densityBlood = 1.055; // g/ml
  const permilleByVolume = permille * densityBlood;
  const percentByVolume = permilleByVolume / 10;
  const plasma = permille * 1.2; // approx 1.2 ratio plasma/blood
  const breath = permille * 0.45; // approx conversion

  // Calculation function for time
  const calculateTime = (resorption: number, beta: number) => {
    const eliminationTime = permille > 0 ? permille / beta : 0;
    
    // Standard calculation: Resorption Phase + Elimination Phase
    let totalHours = resorption + eliminationTime;
    let soberDate = start.add(totalHours * 60, "minute");
    
    // 1. Peak Correction (for display purposes)
    // If drinking over a long time, the peak is lower because elimination happened during drinking.
    // Assuming constant elimination (zero-order) during drinking if C > 0.
    // Effective Peak ~ C0 - (beta * duration).
    // If duration is very long (slow drinking), peak might be very low.
    // Note: This is an estimation. 
    
    // 2. Sober Time Correction (Edge Case)
    // If the calculated sober date is BEFORE the end of drinking (plus absorption),
    // it means the user drank slower than they eliminated. 
    // In that case, they are "sober" shortly after the last drink.
    const minimumSoberDate = end.add(resorption * 60, "minute");
    
    if (soberDate.isBefore(minimumSoberDate)) {
        soberDate = minimumSoberDate;
        // Recalculate totalHours from start to new soberDate
        totalHours = soberDate.diff(start, "hour", true);
    }

    const totalMinutes = totalHours * 60;
    
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: Math.round(totalMinutes % 60),
      soberDate: soberDate,
    };
  };

  // Calculate estimated peak based on average elimination (0.15) if end is provided
  let estimatedPeakPermille = permille;
  const durationHours = Math.max(0, end.diff(start, "hour", true));
  // Estimate elimination during drinking using average beta 0.15
  const eliminatedDuringDrinking = 0.15 * durationHours;
  estimatedPeakPermille = Math.max(0, permille - eliminatedDuringDrinking);

  return {
    alcoholGrams, // Общее количество чистого алкоголя в граммах
    permille, // Теоретическая максимальная концентрация алкоголя в крови (‰)
    estimatedPeakPermille, // Оценочная пиковая концентрация с учетом времени употребления (‰)
    permilleByVolume, // Концентрация алкоголя в крови по объему (‰ BAC). РФ: > 0.3 г/л — лишение прав.
    percentByVolume, // Процентное содержание алкоголя в крови (% BAC)
    plasma, // Концентрация в плазме крови (г/л)
    breath, // Концентрация в выдыхаемом воздухе (мг/л). РФ: > 0.16 мг/л — лишение прав.
    minTime: calculateTime(0.5, 0.20), // Минимальное время трезвости (быстрый метаболизм)
    avgTime: calculateTime(0.75, 0.15), // Среднее время трезвости (нормальный метаболизм)
    maxTime: calculateTime(1.0, 0.10), // Максимальное время трезвости (медленный метаболизм)
  };
};
