import { advancePlayer, endGame } from "./PokerLogic";
import { PokerState } from "../schema/PokerState";
import { PokerRoom } from "../PokerRoom";
import { getNextPlayer } from "./PokerHelper";

export function foldPlayer(state: PokerState, seat: number, room: PokerRoom) {
  state.players[seat].card1 = "EM";
  state.players[seat].card2 = "EM";
  state.players[seat].isFolded = true;

  // update last player if you are the last player
  if (seat === state.lastPlayer) {
    state.lastPlayer = getNextPlayer(state, seat);
  }

  advancePlayer(state, room);
  room.notifyHands(true);
}

function checkRoundEnd(state: PokerState, room: PokerRoom): boolean {
  let activePlayers = 0;
  state.players.forEach((p) => {
    if (p.isSeated && !p.isFolded) {
      activePlayers++;
    }
  });

  return activePlayers == 1;
}

export function betPlayer(state: PokerState, seat: number, betMessage: number, room: PokerRoom): boolean {
  const betSuccess = doBetPlayer(state, seat, betMessage);
  if (betSuccess) advancePlayer(state, room);
  return betSuccess;
}

// TODO prevent bets that are greater than neccessary

function doBetPlayer(state: PokerState, seat: number, betMessage: number): boolean {
  const playerCurrentBet = state.players[seat].bet;
  const playerChips = state.players[seat].chips;
  const amountSpent = betMessage - playerCurrentBet;
  const isAllIn = amountSpent >= playerChips;

  if (betMessage < state.currentBet) {
    return false;
  } else if (betMessage === state.currentBet) {
    // check
    if (betMessage === playerCurrentBet) return true;

    // call
    const neededToCall = state.currentBet - playerCurrentBet;
    const ableToCall = Math.min(neededToCall, playerChips);
    state.players[seat].bet += ableToCall;
    state.players[seat].chips -= ableToCall;
    return true;
  } else {
    // raise
    const minRaise = Math.max(state.currentBet * 2, state.bigBlind);
    if (!isAllIn && betMessage < minRaise) return false;
    state.players[seat].bet = betMessage;
    state.players[seat].chips -= amountSpent;
    state.lastPlayer = seat;
    state.currentBet = betMessage;
    return true;
  }
}
