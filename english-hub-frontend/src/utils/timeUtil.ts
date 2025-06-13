export function longToString(long: number): string {
  if (long <= 0) {
    return '0 seconds';
  }

  const MS_IN_HOUR = 1000 * 60 * 60;
  const MS_IN_MINUTE = 1000 * 60;
  const MS_IN_SECOND = 1000;

  const hours = Math.floor(long / MS_IN_HOUR);
  const minutes = Math.floor((long % MS_IN_HOUR) / MS_IN_MINUTE);
  const seconds = Math.floor((long % MS_IN_MINUTE) / MS_IN_SECOND);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }

  if (seconds > 0) {
    parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  }

  if (parts.length === 0) {
    return '0 seconds';
  }

  return parts.join(' ');
}
