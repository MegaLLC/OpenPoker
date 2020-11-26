import { Client, Room } from "colyseus.js";

export class Network {
  client: Client;
  room: Room | undefined;
  seat: number = 0;
  setStateCallback: any;
  pastSession: string | undefined;

  constructor(setStateCallback) {
    this.client = new Client("ws://localhost:2567");
    this.setStateCallback = setStateCallback;
    this.connect();
  }

  onJoin(room) {
    this.room = room;
    this.pastSession = room.sessionId;
    room.onStateChange((state) => {
      this.setStateCallback({ connected: true, game: room.state, net: this });
    });

    room.onLeave((code) => {
      this.setStateCallback({ connected: false, net: this });
      this.room = undefined;
      console.log("Server has crashed -_-");
    });
  }

  connect() {
    this.client.joinOrCreate("main").then((room) => this.onJoin(room));
  }

  startGame() {
    this.room!.send("start");
  }

  bet(bet: number) {
    this.room!.send("bet", bet);
  }

  fold() {
    this.room!.send("fold");
  }

  join(seat: number) {
    this.room!.send("sit", seat);
    this.seat = seat;
  }
}
