import { getNextPlayer } from "./PokerHelper";
import { PokerState } from "./schema/PokerState";

export function foldPlayer(state: PokerState, seat: number) {
  console.log("new player:" + state.currentPlayer);
  let player = state.players[seat];
  player.card1 = "EM";
  player.card2 = "EM";
  state.currentPlayer = getNextPlayer(state, seat);
}
