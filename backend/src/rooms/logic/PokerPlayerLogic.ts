import { advancePlayer, endGame } from "./PokerLogic";
import { PokerState } from "../schema/PokerState";
import { PokerRoom } from "../PokerRoom";
import { getNextPlayer } from "./PokerHelper";

export function foldPlayer(state: PokerState, seat: number, room: PokerRoom) {
  state.players[seat].card1 = "EM";
  state.players[seat].card2 = "EM";
  state.players[seat].isFolded = true;

  if (checkRoundEnd(state, room)) {
    endGame(state, room);
  } else {
    advancePlayer(state, room);
  }

  // update last player if you are the last player
  if (seat === state.lastPlayer) {
    state.lastPlayer = getNextPlayer(state, seat);
  }

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
  let playerCurrentBet = state.players[seat].bet;

  // betting more than you own
  const amountSpent = betMessage - playerCurrentBet;
  if (amountSpent > state.players[seat].chips) return false;

  if (amountSpent === state.players[seat].chips) {
    console.log("all in");
  }

  if (betMessage < state.currentBet) {
    // can't play on without paying
    return false;
  } else if (betMessage === state.currentBet) {
    if (betMessage === playerCurrentBet) return true; // check

    // call
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
