import { PokerRoom } from "../PokerRoom";
import * as _ from "lodash";
import { PokerState } from "../schema/PokerState";
import { sum } from "lodash";

export const MOCK_ROOM = <PokerRoom>(<unknown>{
  notifyHand: _.noop,
  notifyBoard: _.noop,
  notifyResults: _.noop,
  notifyClearHands: _.noop,
  notifyHands: _.noop,
});

export function sumPot(state: PokerState) {
  return sum(state.pot.map((potState) => potState.chips));
}
