import { Room, Client } from "colyseus";
import { PokerState } from "./schema/PokerState";
import { newHand } from "./logic/PokerLogic";
import { PokerPlayer } from "./schema/PlayerState";
import { isTurn, parseSeat } from "./RoomHelper";
import { betPlayer, foldPlayer } from "./logic/PokerPlayerLogic";
import { Streets } from "./logic/PokerConstants";

export class PokerRoom extends Room<PokerState> {
  idToSeat: Map<string, number> = new Map();

  onCreate(options: any) {
    this.setState(new PokerState());

    this.onMessage("start", (client, message) => {
      console.log(client.id + " has started a game");
      newHand(this.state, this);
    });

    this.onMessage("bet", (client, message) => {
      console.log(client.id + " has bet " + message);
      if (!isTurn(this.state, this.idToSeat, client.id)) return false;
      let bet = Number(message);
      if (bet === NaN) return false;
      betPlayer(this.state, this.idToSeat.get(client.id), bet, this);
    });

    this.onMessage("fold", (client, message) => {
      if (!isTurn(this.state, this.idToSeat, client.id)) return false;
      foldPlayer(this.state, this.idToSeat.get(client.id), this);
    });

    // TODO fix joining while hand is in progress
    this.onMessage("sit", (client, message) => {
      let requestSeat = parseSeat(message);
      if (requestSeat === NaN) return false;
      // seat is empty
      if (this.state.players[requestSeat].isSeated) return false;
      // not sitting else where
      for (let i = 0; i < this.state.players.length; i++) {
        if (this.state.players[i].clientID === client.id) return false;
      }
      this.idToSeat.set(client.id, requestSeat);
      let newPlayer = this.state.players[requestSeat];
      newPlayer.clientID = client.id;
      newPlayer.isSeated = true;
      newPlayer.name = client.id;
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {
    this.state.players[this.idToSeat.get(client.id)] = new PokerPlayer();
    this.idToSeat.delete(client.id);
  }

  notifyResults(winners: Array<number>): void {
    this.broadcast("end_hand", winners);
    this.clients;
  }

  notifyHands(hidden: boolean): void {
    // TODO mucking hands

    let hands = [];
    this.state.players.forEach((p) => {
      hands.push([p.card1, p.card2]);
    });

    this.clients.forEach((c) => {
      let hiddenHands = [...hands];

      if (hidden) {
        for (let i = 0; i < hands.length; i++) {
          if (i != this.idToSeat.get(c.id) && hands[i][0] != "EM") {
            hiddenHands[i] = ["HD", "HD"];
          }
        }
      }

      c.send("hands", hiddenHands);
    });
  }

  notifyClearHands(): void {
    // TODO mucking hands

    let hands = [
      ["EM", "EM"],
      ["EM", "EM"],
      ["EM", "EM"],
      ["EM", "EM"],
      ["EM", "EM"],
      ["EM", "EM"],
      ["EM", "EM"],
      ["EM", "EM"],
      ["EM", "EM"],
    ];
    this.clients.forEach((c) => {
      c.send("hands", hands);
    });
  }

  notifyBoard(): void {
    let cards: any = {};
    switch (this.state.street) {
      case Streets.SHOWDOWN:
      case Streets.RIVER:
        cards.card5 = this.state.card5;
      case Streets.TURN:
        cards.card4 = this.state.card4;
      case Streets.FLOP:
        cards.card1 = this.state.card1;
        cards.card2 = this.state.card2;
        cards.card3 = this.state.card3;
    }
    this.broadcast("board", cards);
  }

  onDispose() {}
}
