export function parseSeat(input: any): number {
  let requestSeat = Number(input);
  if (requestSeat === NaN) return NaN;
  if (requestSeat > 8 || requestSeat < 0) return NaN;
  return requestSeat;
}
