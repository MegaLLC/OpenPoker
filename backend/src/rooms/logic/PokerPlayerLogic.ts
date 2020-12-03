import { advancePlayer } from "./PokerLogic";
import { PokerState } from "../schema/PokerState";
import { Room } from "colyseus/lib/Room";
import { PokerRoom } from "../PokerRoom";

export function foldPlayer(state: PokerState, seat: number, room: PokerRoom) {
  let player = state.players[seat];
  player.card1 = "EM";
  player.card2 = "EM";
  player.isFolded = true;
  advancePlayer(state, room);
}

export function betPlayer(state: PokerState, seat: number, betMessage: number, room: PokerRoom): boolean {
  const betSuccess = doBetPlayer(state, seat, betMessage);
  if (betSuccess) advancePlayer(state, room);
  return betSuccess;
}

function doBetPlayer(state: PokerState, seat: number, betMessage: number): boolean {
  let playerCurrentBet = state.players[seat].bet;

  // betting more than you own
  const amountSpent = betMessage - playerCurrentBet;
  if (amountSpent > state.players[seat].chips) return false;

  if (betMessage < state.currentBet) {
    // can't play on without paying
    return false;
  } else if (betMessage === state.currentBet) {
    if (betMessage === playerCurrentBet) return true; // check

    // call
    // TODO out of money edge cases
    // TODO handle all in cases
    let neededToCall = state.currentBet - playerCurrentBet;
    state.players[seat].bet += neededToCall;
    state.players[seat].chips -= neededToCall;
    return true;
  } else {
    // raise
    const minRaise = state.currentBet * 2;
    if (betMessage < minRaise) return false;
    state.players[seat].bet = betMessage;
    state.players[seat].chips -= amountSpent;
    state.lastPlayer = seat;
    state.currentBet = betMessage;
    return true;
  }
}
