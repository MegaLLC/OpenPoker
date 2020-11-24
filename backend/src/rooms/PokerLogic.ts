import { PokerState } from "./schema/PokerState";
import { Streets, DECK } from "./PokerConstants";
import * as _ from "lodash";
import * as PH from "./PokerHelper";

export function newHand(state: PokerState) {
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
    }
  });

  // set roles
  state.street = Streets.PREFLOP;
  state.currentDealer = PH.getNextDealer(state);
  state.firstPlayer = PH.getFirstPlayer(state);
  state.currentPlayer = state.firstPlayer;

  // blinds
  // TODO edge case when players are unable to post blinds
  let small = PH.getSmallBlind(state);
  state.players[small].chips -= state.smallBlind;
  state.players[small].bet = state.smallBlind;
  state.pot += state.smallBlind;

  let big = PH.getBigBlind(state);
  state.players[big].chips -= state.bigBlind;
  state.players[big].bet = state.bigBlind;
  state.pot += state.bigBlind;

  state.currentBet = state.bigBlind;
}
