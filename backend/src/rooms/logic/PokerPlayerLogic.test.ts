import _ from "lodash";
import { PokerState } from "../schema/PokerState";
import { MAX_PLAYERS } from "./PokerConstants";
import { getNextPlayer } from "./PokerHelper";
import { newHand } from "./PokerLogic";
import { betPlayer, foldPlayer } from "./PokerPlayerLogic";
import { MOCK_ROOM } from "./MockRoom";

jest.useFakeTimers();

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
    foldPlayer(state, 7, MOCK_ROOM);
    expect(state.players[7].isFolded).toBeTruthy();
    expect(state.players[7].card1).toBe("EM");
    expect(state.players[7].card2).toBe("EM");
  });
  test("Current player advanced", () => {
    let prevPlayer = state.currentPlayer;
    foldPlayer(state, 7, MOCK_ROOM);
    expect(state.currentPlayer).not.toBe(prevPlayer);
  });
  test("one player left ends game", () => {
    newHand(state, MOCK_ROOM);
    state.players.forEach((p) => {
      p.isFolded = true;
    });
    state.players[3].isFolded = false;
    state.players[3].bet = 30;
    state.players[2].isFolded = false;
    state.players[2].bet = 10;
    state.pot = 200;
    const statecopy = state.clone();
    statecopy.players[2].bet = 0;
    statecopy.players[2].isFolded = true;
    statecopy.players[3].bet = 0;
    statecopy.players[3].chips += 240;
    statecopy.pot = 0;
    statecopy.street = 4;
    foldPlayer(state, 2, MOCK_ROOM);
    expect(state).toStrictEqual(statecopy);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), expect.any(Number));
  });
});

describe("betPlayer() tests", () => {
  test("Negative bet", () => {
    newHand(state, MOCK_ROOM);
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, -5, MOCK_ROOM)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });
  test("Invalid bet", () => {
    newHand(state, MOCK_ROOM);
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, 0, MOCK_ROOM)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Call bet", () => {
    newHand(state, MOCK_ROOM);
    let stateCopy = state.clone();
    let bet = state.currentBet;
    stateCopy.players[4].bet += bet;
    stateCopy.players[4].chips -= bet;
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 4, bet, MOCK_ROOM)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Check bet", () => {
    newHand(state, MOCK_ROOM);
    let stateCopy = state.clone();
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 3, state.currentBet, MOCK_ROOM)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Insufficient funds to call", () => {
    newHand(state, MOCK_ROOM);
    state.currentBet = state.players[5].chips + 1;
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, state.currentBet, MOCK_ROOM)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Insufficient funds to raise", () => {
    newHand(state, MOCK_ROOM);
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, 0, MOCK_ROOM)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Illegal raise", () => {
    newHand(state, MOCK_ROOM);
    state.currentBet = 60;
    state.players[5].chips = 10000;
    let stateCopy = state.clone();

    expect(betPlayer(state, 5, state.currentBet + 1, MOCK_ROOM)).toBe(false);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Min raise", () => {
    newHand(state, MOCK_ROOM);
    state.currentBet = 60;
    state.currentPlayer = 5;
    state.players[5].chips = 10000;
    const raise = state.currentBet * 2;
    let stateCopy = state.clone();
    stateCopy.currentBet = raise;
    stateCopy.players[5].bet += raise;
    stateCopy.players[5].chips -= raise;
    stateCopy.lastPlayer = 5;
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 5, raise, MOCK_ROOM)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Standard raise", () => {
    newHand(state, MOCK_ROOM);
    state.currentBet = 60;
    state.currentPlayer = 5;
    state.players[5].chips = 10000;
    const raise = state.currentBet * 2 + 1;
    let stateCopy = state.clone();
    stateCopy.currentBet = raise;
    stateCopy.players[5].bet += raise;
    stateCopy.players[5].chips -= raise;
    stateCopy.lastPlayer = 5;
    stateCopy.currentPlayer = getNextPlayer(stateCopy, stateCopy.currentPlayer);

    expect(betPlayer(state, 5, raise, MOCK_ROOM)).toBe(true);
    expect(state).toStrictEqual(stateCopy);
  });
});
