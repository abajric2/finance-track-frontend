export function getNextRecurringDate(
  startDate: string | Date,
  frequency: string
): string {
  const now = new Date();
  const start = new Date(startDate);

  if (start > now) return start.toLocaleDateString();

  let next = new Date(start);
  while (next <= now) {
    switch (frequency.toLowerCase()) {
      case "daily":
        next.setDate(next.getDate() + 1);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "yearly":
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        return "N/A";
    }
  }

  return next.toLocaleDateString();
}
