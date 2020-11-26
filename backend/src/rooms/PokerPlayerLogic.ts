import { getNextPlayer } from "./PokerHelper";
import { advancePlayer } from "./PokerLogic";
import { PokerState } from "./schema/PokerState";

export function foldPlayer(state: PokerState, seat: number) {
  let player = state.players[seat];
  player.card1 = "EM";
  player.card2 = "EM";
  player.isFolded = true;
  advancePlayer(state);
}

export function betPlayer(state: PokerState, seat: number, betMessage: number) {
  doBetPlayer(state, seat, betMessage);
  advancePlayer(state);
}

function doBetPlayer(state: PokerState, seat: number, betMessage: number): boolean {
  let playerCurrentBet = state.players[seat].bet;
  if (betMessage < state.currentBet) {
    // can't play on without paying
  } else if (betMessage === state.currentBet) {
    if (betMessage < playerCurrentBet) return false; // taking money out
    if (betMessage === playerCurrentBet) return true; // check

    // call
    // TODO out of money edge cases
    let neededToCall = state.currentBet - playerCurrentBet;
    state.players[seat].bet += neededToCall;
    state.players[seat].chips -= neededToCall;
    return true;
  } else if (betMessage > state.currentBet) {
    // raise
  }
}
