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
      console.log(client.id + " said " + message);
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

  notifyHand(): void {
    this.clients.forEach((c) => {
      this.state.players.forEach((p) => {
        if (p.clientID === c.id) {
          c.send("cards", { card1: p.card1, card2: p.card2 });
        }
      });
    });
  }

  notifyHands(): void {
    // TODO mucking hands

    let hands = [];
    this.state.players.forEach((p) => {
      hands.push([p.card1, p.card2]);
    });

    this.clients.forEach((c) => {
      c.send("showdown", hands);
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
      c.send("showdown", hands);
    });
  }

  notifyBoard(): void {
    let cards: any = {};
    switch (this.state.street) {
      case Streets.RIVER:
        cards.card5 = this.state.card5;
      case Streets.TURN:
        cards.card4 = this.state.card4;
      case Streets.FLOP:
        cards.card1 = this.state.card1;
        cards.card2 = this.state.card2;
        cards.card3 = this.state.card3;
      default:
        break;
    }
    this.broadcast("board", cards);
  }

  onDispose() {}
}
