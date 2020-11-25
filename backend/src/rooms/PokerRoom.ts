import { Room, Client } from "colyseus";
import { PokerState } from "./schema/PokerState";
import { newHand } from "./PokerLogic";
import { PokerPlayer } from "./schema/PlayerState";

export class PokerRoom extends Room<PokerState> {
  idToSeat: Map<string, number> = new Map();

  onCreate(options: any) {
    this.setState(new PokerState());

    this.onMessage("bet", (client, message) => {
      console.log(client.id + " has bet " + message);
      this.state.pot += parseFloat(message);
    });

    this.onMessage("start", (client, message) => {
      console.log(client.id + " said " + message);
      newHand(this.state);
    });

    this.onMessage("fold", (client, message) => {
      console.log(client.id + " folded");
    });

    this.onMessage("sit", (client, message) => {
      console.log(client.id + " sat in seat " + message);
      let requestSeat = Number(message);
      if (requestSeat === NaN) return false;
      if (requestSeat > 8 || requestSeat < 0) return false;
      if (this.state.players[requestSeat].isSeated) return false;
      for (let i = 0; i < this.state.players.length; i++) {
        if (this.state.players[i].clientID === client.id) return false;
      }
      this.idToSeat[client.id] = requestSeat;
      let newPlayer = this.state.players[requestSeat];
      newPlayer.clientID = client.id;
      newPlayer.isSeated = true;
      newPlayer.name = "Joe";
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {
    this.state.players[this.idToSeat[client.id]] = new PokerPlayer();
  }

  onDispose() {}
}
