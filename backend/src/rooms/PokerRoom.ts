import { Room, Client } from "colyseus";
import { PokerState } from "./schema/PokerState";
import { newHand } from "./PokerLogic";

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
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
