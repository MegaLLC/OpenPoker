import { PokerState } from "../schema/PokerState";
import { MAX_PLAYERS } from "./PokerConstants";
import { getNextPlayer } from "./PokerHelper";
import { newHand } from "./PokerLogic";
import { betPlayer, foldPlayer } from "./PokerPlayerLogic";

let state: PokerState;
beforeEach(() => {
  state = new PokerState();
  for (let i = 0; i < MAX_PLAYERS; i++) {
    state.players[i].isSeated = true;
    state.players[i].isFolded = false;
  }
});

describe("foldPlayer() tests", () => {
  test("Player is folded", () => {
    foldPlayer(state, 7);
    expect(state.players[7].isFolded).toBeTruthy();
    expect(state.players[7].card1).toBe("EM");
    expect(state.players[7].card2).toBe("EM");
  });
  test("Current player advanced", () => {
    let prevPlayer = state.currentPlayer;
    foldPlayer(state, 7);
    expect(state.currentPlayer).not.toBe(prevPlayer);
  });
});

describe("betPlayer() tests", () => {
  test("Negative bet", () => {
    newHand(state);
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, -5)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });
  test("Invalid bet", () => {
    newHand(state);
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, 0)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Call bet", () => {
    newHand(state);
    let stateCopy = state.clone();
    let bet = state.currentBet;
    stateCopy.players[4].bet += bet;
    stateCopy.players[4].chips -= bet;
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 4, bet)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Check bet", () => {
    newHand(state);
    let stateCopy = state.clone();
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 3, state.currentBet)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Insufficient funds to call", () => {
    newHand(state);
    state.currentBet = state.players[5].chips + 1;
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, state.currentBet)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Insufficient funds to raise", () => {
    newHand(state);
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, 0)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Illegal raise", () => {
    newHand(state);
    state.currentBet = 60;
    state.players[5].chips = 10000;
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, state.currentBet + 1)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Min raise", () => {
    newHand(state);
    state.currentBet = 60;
    state.currentPlayer = 5;
    state.players[5].chips = 10000;
    const raise = state.currentBet * 2;
    let stateCopy = state.clone();
    stateCopy.players[5].bet += raise;
    stateCopy.players[5].chips -= raise;
    stateCopy.lastPlayer = 5;
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 5, raise)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Standard raise", () => {
    newHand(state);
    state.currentBet = 60;
    state.currentPlayer = 5;
    state.players[5].chips = 10000;
    const raise = state.currentBet * 2 + 1;
    let stateCopy = state.clone();
    stateCopy.players[5].bet += raise;
    stateCopy.players[5].chips -= raise;
    stateCopy.lastPlayer = 5;
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 5, raise)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });
});
