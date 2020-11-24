import { Room, Client } from "colyseus";
import { PokerState } from "./schema/PokerState";
import { newHand, foldHand } from "./PokerLogic";

export class PokerRoom extends Room<PokerState> {
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
      foldHand(this.state);
    });
  }

  // TODO change this to fire when a client joins the game room, which should be a status request
  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
