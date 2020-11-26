import { Room, Client } from "colyseus";
import { PokerState } from "./schema/PokerState";
import { newHand } from "./PokerLogic";
import { PokerPlayer } from "./schema/PlayerState";
import { parseSeat } from "./RoomHelper";
import { betPlayer, foldPlayer } from "./PokerPlayerLogic";

export class PokerRoom extends Room<PokerState> {
  idToSeat: Map<string, number> = new Map();

  onCreate(options: any) {
    this.setState(new PokerState());

    this.onMessage("bet", (client, message) => {
      console.log(client.id + " has bet " + message);
      let bet = Number(message);
      if (bet === NaN) return false;
      betPlayer(this.state, this.idToSeat[client.id], bet);
    });

    this.onMessage("start", (client, message) => {
      console.log(client.id + " said " + message);
      newHand(this.state);
    });

    this.onMessage("fold", (client, message) => {
      // is their turn
      if (!(this.state.currentPlayer === this.idToSeat[client.id])) return false;
      foldPlayer(this.state, this.idToSeat[client.id]);
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
      this.idToSeat[client.id] = requestSeat;
      let newPlayer = this.state.players[requestSeat];
      newPlayer.clientID = client.id;
      newPlayer.isSeated = true;
      newPlayer.name = client.id;
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {
    this.state.players[this.idToSeat[client.id]] = new PokerPlayer();
  }

  onDispose() {}
}
