export function longToString(long: number): string {
  const hours = Math.floor(long / (1000 * 60 * 60));
  const minutes = Math.floor((long % (1000 * 60 * 60)) / (1000 * 60)); 
  const seconds = Math.floor((long % (1000 * 60)) / 1000); 

  let result = '';
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? 's' : ''} `; 
  }
  if (minutes > 0) {
    result += `${minutes} minute${minutes > 1 ? 's' : ''} `; 
  }

  if (seconds > 0) {
    result += `${seconds} second${seconds > 1 ? 's' : ''}`; 
  }

  if (result === '') {
    result = '0 seconds'; 
  }
  return result.trim(); 
}
