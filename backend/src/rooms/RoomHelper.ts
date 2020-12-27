import { Streets } from "./logic/PokerConstants";
import { PokerState } from "./schema/PokerState";

export function parseSeat(input: any): number {
  let requestSeat = Number(input);
  if (requestSeat === NaN) return NaN;
  if (requestSeat > 8 || requestSeat < 0) return NaN;
  return requestSeat;
}

export function isTurn(state: PokerState, idToSeat: Map<string, number>, id: string): boolean {
  let isTurn = state.currentPlayer === idToSeat.get(id);
  return isTurn && state.street != Streets.SHOWDOWN;
}
