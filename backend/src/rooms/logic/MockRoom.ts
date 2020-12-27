import { PokerRoom } from "../PokerRoom";
import * as _ from "lodash";

export const MOCK_ROOM = <PokerRoom>{
  notifyHand: _.noop,
  notifyBoard: _.noop,
  notifyResults: _.noop,
  notifyClearHands: _.noop,
  notifyHands: _.noop,
};
