import { Dayjs } from "dayjs";

export type TimelineDrink = {
  id: string;
  volume: number; // ml
  percentage: number; // %
  time: Dayjs;
};

export interface UserStats {
  weight: number; // kg
  gender: "male" | "female";
}

export interface AdePoint {
  date: Dayjs;
  permille: number;
}

export const calculateAde = (
  drinks: TimelineDrink[],
  user: UserStats,
): AdePoint[] => {
  if (drinks.length === 0) return [];

  // Sort drinks by time
  const sortedDrinks = [...drinks].sort((a, b) => a.time.diff(b.time));
  const startTime = sortedDrinks[0].time;

  // Constants
  const r = user.gender === "male" ? 0.7 : 0.6;
  const beta = 0.15; // Average elimination rate (‰/h)
  const absorptionMinutes = 45; // Time to full absorption

  // Elimination rate in grams/minute
  // Widmark: A = C * W * r => C = A / (W * r)
  // Rate of C change (beta) = dC/dt
  // dA/dt = beta * W * r
  const eliminationRateGramsPerMinute = (beta * user.weight * r) / 60;

  const result: AdePoint[] = [];

  // Iterative Simulation
  let currentAlcoholGrams = 0;
  let currentTime = startTime;

  // We'll output every 10 minutes to keep array size manageable, but calculate every minute
  const outputInterval = 10;

  // Map of drink absorptions to track how much of each drink is already absorbed
  // Actually, calculating "Absorbed so far" is stateless and easier.
  // The only stateful part is elimination.
  // Elimination is constant *provided* there is alcohol.
  // So: Alcohol_t = Alcohol_{t-1} + Delta_Absorption - Delta_Elimination

  // Pre-calculate drinks info
  const drinksInfo = sortedDrinks.map((d) => ({
    grams: d.volume * (d.percentage / 100) * 0.79,
    time: d.time,
  }));

  const loopLimit = 24 * 60 * 2; // Max 48 hours to prevent infinite loops
  let minCounter = 0;

  while (minCounter < loopLimit) {
    // 1. Calculate Absorption Delta for this minute
    let deltaAbsorption = 0;

    for (const drink of drinksInfo) {
      const minutesSinceDrink =
        minCounter - drink.time.diff(startTime, "minute");

      // If within absorption window (0 to 45 mins)
      if (minutesSinceDrink >= 0 && minutesSinceDrink < absorptionMinutes) {
        // Amount absorbed per minute = Total / Duration
        deltaAbsorption += drink.grams / absorptionMinutes;
      }
    }

    // 2. Apply changes
    currentAlcoholGrams += deltaAbsorption;

    // 3. Elimination
    if (currentAlcoholGrams > 0) {
      const elimination = Math.min(
        currentAlcoholGrams,
        eliminationRateGramsPerMinute,
      );
      currentAlcoholGrams -= elimination;
    }

    // 4. Record state
    if (minCounter % outputInterval === 0) {
      const permille = currentAlcoholGrams / (user.weight * r);
      result.push({
        date: currentTime,
        permille: Math.max(0, permille),
      });

      // Stop if sober and all drinks processed (checked by time)
      const lastDrinkTime = drinksInfo[drinksInfo.length - 1].time;
      const allDrinksAbsorbed =
        currentTime.diff(lastDrinkTime, "minute") > absorptionMinutes;

      if (currentAlcoholGrams <= 0 && allDrinksAbsorbed && minCounter > 0) {
        break;
      }
    }

    currentTime = currentTime.add(1, "minute");
    minCounter++;
  }

  return result;
};
