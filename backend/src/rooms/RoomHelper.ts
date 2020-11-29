import { PokerState } from "./schema/PokerState";

export function parseSeat(input: any): number {
  let requestSeat = Number(input);
  if (requestSeat === NaN) return NaN;
  if (requestSeat > 8 || requestSeat < 0) return NaN;
  return requestSeat;
}

export function isTurn(state: PokerState, idToSeat: Map<string, number>, id: string): boolean {
  return state.currentPlayer === idToSeat.get(id);
}
