import { PokerState } from "../schema/PokerState";
import { getFirstPlayer, getSmallBlind, getBigBlind } from "./PokerHelper";

let state: PokerState;

beforeEach(() => {
  state = new PokerState();
});

describe("Get player tests", () => {
  test("Heads up", () => {
    state.players[3].isSeated = true;
    state.players[7].isSeated = true;
    state.currentDealer = 7;
    expect(getSmallBlind(state)).toBe(7);
    expect(getBigBlind(state)).toBe(3);
    expect(getFirstPlayer(state)).toBe(7);
  });
  test("3 Player", () => {
    state.players[1].isSeated = true;
    state.players[3].isSeated = true;
    state.players[7].isSeated = true;
    state.currentDealer = 3;
    expect(getSmallBlind(state)).toBe(7);
    expect(getBigBlind(state)).toBe(1);
    expect(getFirstPlayer(state)).toBe(3);
  });
  test("Full table", () => {
    state.players.forEach((p) => {
      p.isSeated = true;
    });
    state.currentDealer = 8;
    expect(getSmallBlind(state)).toBe(0);
    expect(getBigBlind(state)).toBe(1);
    expect(getFirstPlayer(state)).toBe(2);
  });
});
