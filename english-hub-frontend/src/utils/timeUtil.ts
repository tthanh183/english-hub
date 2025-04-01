export function longToString(long: number): string {
  const hours = Math.floor(long / (1000 * 60 * 60)); // Tính số giờ
  const minutes = Math.floor((long % (1000 * 60 * 60)) / (1000 * 60)); // Tính số phút
  const seconds = Math.floor((long % (1000 * 60)) / 1000); // Tính số giây

  return seconds > 0
    ? `${seconds} seconds`
    : minutes > 0
    ? `${minutes} minutes`
    : hours > 0
    ? `${hours} hours`
    : '0 seconds';
}
