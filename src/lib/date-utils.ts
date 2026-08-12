const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Returns current Date formatted in IST timezone.
 */
export function getISTNow(): Date {
  return new Date();
}

/**
 * Formats current date in IST (e.g. "Thursday, 6 August 2026")
 */
export function getFormattedISTDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: IST_TIMEZONE,
  });
}

/**
 * Returns IST Greeting based on real-time IST hour.
 */
export function getISTGreeting(): string {
  const istHourStr = new Date().toLocaleTimeString("en-US", {
    timeZone: IST_TIMEZONE,
    hour12: false,
    hour: "2-digit",
  });
  const hour = parseInt(istHourStr, 10) || new Date().getHours();

  if (hour >= 4 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Late Night Deep Work";
}

/**
 * Returns current IST time string (e.g. "16:22")
 */
export function getISTTimeString(): string {
  return new Date().toLocaleTimeString("en-IN", {
    timeZone: IST_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}
