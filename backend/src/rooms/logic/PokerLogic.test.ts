import { advancePlayer, findWinner, newHand } from "./PokerLogic";

import { PokerState } from "../schema/PokerState";
import { MAX_PLAYERS, Streets } from "./PokerConstants";
import _ from "lodash";
import { PokerRoom } from "../PokerRoom";

let MOCK_ROOM = new PokerRoom();
MOCK_ROOM.notifyHand = _.noop;
MOCK_ROOM.notifyBoard = _.noop;

function createPokerState(board: Array<string>, hands: Array<Array<string>>): PokerState {
  let state = new PokerState();

  state.card1 = board[0];
  state.card2 = board[1];
  state.card3 = board[2];
  state.card4 = board[3];
  state.card5 = board[4];

  for (let i = 0; i < MAX_PLAYERS; i++) {
    state.players[i].isSeated = true;
    if (hands[i]) {
      state.players[i].card1 = hands[i][0];
      state.players[i].card2 = hands[i][1];
    } else {
      state.players[i].isFolded = true;
    }
  }

  return state;
}

describe("newHand() tests", () => {
  test("No duplicate cards", () => {
    let state = new PokerState();
    for (let i = 0; i < MAX_PLAYERS; i++) {
      state.players[i].isSeated = true;
      state.players[i].isFolded = false;
    }
    newHand(state, MOCK_ROOM);
    let cards = new Set<string>();
    cards.add(state.card1);
    cards.add(state.card2);
    cards.add(state.card3);
    cards.add(state.card4);
    cards.add(state.card5);
    state.players.forEach((p) => {
      cards.add(p.card1);
      cards.add(p.card2);
    });

    expect(cards.size).toBe(5 + 9 * 2);
  });
  test("Folded players are unfolded", () => {
    let state = new PokerState();
    for (let i = 0; i < MAX_PLAYERS; i++) {
      state.players[i].isSeated = true;
      state.players[i].isFolded = true;
    }
    newHand(state, MOCK_ROOM);
    expect(state.players.filter((p) => p.isFolded)).toStrictEqual([]);
  });
  test("Correct roles assigned", () => {
    let state = new PokerState();
    state.players[1].isSeated = true;
    state.players[3].isSeated = true;
    state.players[4].isSeated = true;
    state.players[8].isSeated = true;
    state.currentPlayer = 5;
    state.currentDealer = 8;
    newHand(state, MOCK_ROOM);
    expect(state.currentDealer).toBe(1);
    expect(state.currentPlayer).toBe(8);
    expect(state.street).toBe(Streets.PREFLOP);
    expect(state.currentBet).toBe(state.bigBlind);
    expect(state.pot).toBe(0);
  });
});

describe("advancePlayer() tests", () => {
  test("Street doesn't end", () => {
    let state = new PokerState();
    state.players[3].isSeated = true;
    state.players[4].isSeated = true;
    state.players[7].isSeated = true;
    state.currentPlayer = 4;
    state.currentDealer = 3;
    state.lastPlayer = 3;
    let stateCopy = state.clone();
    stateCopy.currentPlayer = 7;
    advancePlayer(state, MOCK_ROOM);
    expect(state).toStrictEqual(stateCopy);
  });

  test("Street ends", () => {
    let state = new PokerState();
    state.players[3].isSeated = true;
    state.players[4].isSeated = true;
    state.players[7].isSeated = true;
    state.currentPlayer = 7;
    state.currentDealer = 3;
    state.lastPlayer = 3;
    let stateCopy = state.clone();
    stateCopy.currentPlayer = 4;
    stateCopy.lastPlayer = 4;
    stateCopy.street = Streets.FLOP;
    advancePlayer(state, MOCK_ROOM);
    expect(state).toStrictEqual(stateCopy);
  });
});

describe("findWinner() tests", () => {
  test("9 Players single winner", () => {
    let state = createPokerState(
      ["5s", "Ac", "8d", "6d", "7h"],
      [
        ["9c", "Ts"], // winner
        ["3c", "4s"],
        ["1h", "2h"],
        ["1s", "2s"],
        ["1d", "2d"],
        ["1c", "2c"],
        ["Ad", "7s"],
        ["As", "7c"],
        ["3c", "7d"],
      ]
    );
    expect(findWinner(state)).toStrictEqual([0]);
  });

  test("9 Players two winners", () => {
    let state = createPokerState(
      ["5s", "Ac", "8d", "6d", "7h"],
      [
        ["3c", "4s"],
        ["1h", "2h"],
        ["1s", "2s"],
        ["1d", "2d"],
        ["9c", "Ts"], // winner 1
        ["1c", "2c"],
        ["Ad", "7s"],
        ["As", "7c"],
        ["9s", "Tc"], // winner 2
      ]
    );
    expect(findWinner(state)).toStrictEqual([4, 8]);
  });

  test("9 Players three winners", () => {
    let state = createPokerState(
      ["5s", "Ac", "8d", "6d", "7h"],
      [
        ["3c", "4s"],
        ["9c", "Ts"], // winner 1
        ["1h", "2h"],
        ["1s", "2s"],
        ["9s", "Tc"], // winner 2
        ["1d", "2d"],
        ["1c", "2c"],
        ["9d", "Td"], // winner 3
        ["Ad", "7s"],
      ]
    );
    expect(findWinner(state)).toStrictEqual([1, 4, 7]);
  });

  test("9 Players all winners", () => {
    let state = createPokerState(
      ["As", "Ts", "Js", "Qs", "Ks"], // royal flush everybody wins :)
      [
        ["Ac", "9s"],
        ["Ad", "Ah"],
        ["7c", "2s"],
        ["7s", "2h"],
        ["7d", "2d"],
        ["Qc", "Qd"],
        ["9c", "4s"],
        ["3d", "9d"],
        ["3h", "Td"],
      ]
    );
    expect(findWinner(state)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
