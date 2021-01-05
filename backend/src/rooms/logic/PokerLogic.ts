import { PokerState } from "../schema/PokerState";
import { Streets, DECK, MAX_PLAYERS } from "./PokerConstants";
import * as _ from "lodash";
import { Hand } from "pokersolver";
import * as PH from "./PokerHelper";
import { PokerRoom } from "../PokerRoom";
import { max, min } from "lodash";
import { PotState } from "../schema/PotState";
import { SetSchema } from "@colyseus/schema";

export function newHand(state: PokerState, room: PokerRoom) {
  // distribute cards and reset board.
  let deck = _.shuffle(DECK);
  state.card1 = deck[1];
  state.card2 = deck[2];
  state.card3 = deck[3];
  state.card4 = deck[4];
  state.card5 = deck[5];
  let currentCard = 10;
  state.players.forEach((player) => {
    if (player.isSeated) {
      player.card1 = deck[currentCard++];
      player.card2 = deck[currentCard++];
      player.bet = 0;
      player.isFolded = false;
    }
  });

  // set roles
  state.street = Streets.PREFLOP;
  state.currentDealer = PH.getNextDealer(state);
  state.lastPlayer = PH.getFirstPlayer(state);
  state.currentPlayer = state.lastPlayer;

  // blinds
  // TODO edge case when players are unable to post blinds
  let small = PH.getSmallBlind(state);
  state.players[small].chips -= state.smallBlind;
  state.players[small].bet = state.smallBlind;

  let big = PH.getBigBlind(state);
  state.players[big].chips -= state.bigBlind;
  state.players[big].bet = state.bigBlind;

  state.currentBet = state.bigBlind;
  // room.notifyClearHands();
  room.notifyHands(true);
  room.notifyBoard();
}

export function advancePlayer(state: PokerState, room: PokerRoom) {
  state.currentPlayer = PH.getNextPlayer(state, state.currentPlayer);
  if (state.currentPlayer === state.lastPlayer) {
    advanceStreet(state, room);
  }

  // if player is all in, skip them
  if (state.players[state.currentPlayer].chips == 0) {
    advancePlayer(state, room);
  }
}

// clear out bets and put it into the pot
// append pot states to the pot calculate and popstate objects to represent parts of the pot
// and players who are entitled to said part
export function submitBets(state: PokerState) {
  let bets = state.players.map((p) => p.bet);
  for (let i = 0; i < state.players.length; i++) {
    state.players[i].bet = 0;
  }

  while (max(bets) > 0) {
    const smallestBet = min(bets.filter((bet) => bet > 0));
    bets = bets.map((playerBet) => playerBet - smallestBet);
    const potState = new PotState();

    for (let i = 0; i < bets.length; i++) {
      if (bets[i] >= 0) {
        if (!state.players[i].isFolded) {
          potState.contenders.add(i);
        }
      }
    }
    potState.chips = smallestBet * potState.contenders.size;
    state.pot.push(potState);
  }
}

function advanceStreet(state: PokerState, room: PokerRoom) {
  submitBets(state);

  console.log(state.pot);
  console.log(state.pot.length);
  state.street++;
  state.currentPlayer = PH.getNextPlayer(state, state.currentDealer);
  state.currentBet = 0;
  state.lastPlayer = state.currentPlayer;
  room.notifyBoard();
  if (state.street == Streets.SHOWDOWN) {
    endGame(state, room);
  }
}

export function findWinners(state: PokerState, contenders: SetSchema<number>): Array<number> {
  var board = [state.card1, state.card2, state.card3, state.card4, state.card5];
  var currWinners = []; // indices of winners

  console.log(contenders);

  // find winners out of all players
  for (let i = 0; i < MAX_PLAYERS; ++i) {
    // ignores those not in the pot
    if (!contenders.has(i)) continue;

    let player = state.players[i];

    // hand of current player
    let playerHand = Hand.solve([player.card1, player.card2, ...board]);

    if (currWinners.length == 0) {
      currWinners.push(i);
    } else {
      // compare hands
      let leader = state.players[currWinners[0]];
      const leaderHand = Hand.solve([leader.card1, leader.card2, ...board]);
      let cmp = leaderHand.compare(playerHand);
      if (cmp === 1) {
        // found a better hand, discard current winners
        currWinners = [];
        currWinners.push(i);
      } else if (cmp === 0) {
        // found an equal find, add to current winners
        currWinners.push(i);
      }
    }
  }
  return currWinners;
}

export function endGame(state: PokerState, room: PokerRoom): void {
  state.street = Streets.SHOWDOWN;
  submitBets(state);

  let allWinners = new Set();

  while (state.pot.length) {
    const currentPot = state.pot.pop();
    const winners = findWinners(state, currentPot.contenders);
    const winnings = Math.round((currentPot.chips * 100) / winners.length) / 100;
    winners.forEach((i) => {
      state.players[i].chips += winnings;
    });
    allWinners = new Set([...allWinners, ...winners]);
  }

  setTimeout(() => {
    newHand(state, room);
  }, 5000);
  room.notifyResults(<number[]>[...allWinners]);
  room.notifyHands(false);
}
