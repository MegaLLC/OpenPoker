import { Room, Client } from "colyseus";
import { PokerState } from "./schema/PokerState";

export class PokerRoom extends Room {
  onCreate(options: any) {
    this.setState(new PokerState());

    this.onMessage("bet", (client, message) => {
      console.log(client.id + " has bet " + message);
      this.state.pot += parseFloat(message);
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
