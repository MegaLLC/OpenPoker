import { PokerPlayer } from "./schema/PlayerState";
import { PokerState } from "./schema/PokerState";

// gets next player
function getNextPlayer(state: PokerState, currentPlayer: number): number {
  currentPlayer++;
  while (!state.players[currentPlayer].isSeated) {
    currentPlayer++;
    currentPlayer %= 9;
  }
  return currentPlayer;
}

export function getNextDealer(state: PokerState): number {
  return getNextPlayer(state, state.currentDealer);
}

export function getFirstPlayer(state: PokerState): number {
  // special case for heads-up poker
  if (state.playerCount === 2) return getNextPlayer(state, state.currentDealer);
  return getNextPlayer(state, getBigBlind(state));
}

export function getBigBlind(state: PokerState): number {
  // special case for heads-up poker
  if (state.playerCount === 2) return getNextPlayer(state, state.currentDealer);
  return getNextPlayer(state, getSmallBlind(state));
}
export function getSmallBlind(state: PokerState): number {
  // special case for heads-up poker
  if (state.playerCount === 2) return state.currentDealer;
  return getNextPlayer(state, state.currentDealer);
}

export function addPlayer(state: PokerState, player: PokerPlayer, seat: number) {
  state.playerCount++;
  state.players[seat] = player;
}

export function removePlayer(state: PokerState, seat: number) {
  state.playerCount--;
  state.players[seat].isSeated = false;
}
