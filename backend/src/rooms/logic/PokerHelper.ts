import { PokerPlayer } from "../schema/PlayerState";
import { PokerState } from "../schema/PokerState";

// gets next player at the table
export function getNextPlayer(state: PokerState, currentPlayer: number): number {
  let rip = 0;
  do {
    rip++;
    if (rip > 100) return NaN;
    currentPlayer++;
    currentPlayer %= 9;
  } while (!state.players[currentPlayer].isSeated || state.players[currentPlayer].isFolded);
  return currentPlayer;
}

export function getNextDealer(state: PokerState): number {
  return getNextPlayer(state, state.currentDealer);
}

export function getFirstPlayer(state: PokerState): number {
  // special case for heads-up poker
  if (countPlayers(state) === 2) return state.currentDealer;
  return getNextPlayer(state, getBigBlind(state));
}

export function getBigBlind(state: PokerState): number {
  // special case for heads-up poker
  if (countPlayers(state) === 2) return getNextPlayer(state, state.currentDealer);
  return getNextPlayer(state, getSmallBlind(state));
}
export function getSmallBlind(state: PokerState): number {
  // special case for heads-up poker
  if (countPlayers(state) === 2) return state.currentDealer;
  return getNextPlayer(state, state.currentDealer);
}

function countPlayers(state: PokerState): number {
  return state.players.filter((p) => p.isSeated).length;
}
