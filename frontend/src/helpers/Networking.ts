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

    this.room!.onMessage("end_hand", (msg) => {
      console.log(msg);
    });

    this.room!.onMessage("cards", (msg) => {
      this.room!.state.players[this.seat].card1 = msg.card1;
      this.room!.state.players[this.seat].card2 = msg.card2;
      this.setStateCallback({ connected: true, game: this.room!.state, net: this });
    });

    this.room!.onMessage("board", (msg) => {
      this.room!.state.card1 = msg.card1;
      this.room!.state.card2 = msg.card2;
      this.room!.state.card3 = msg.card3;
      this.room!.state.card4 = msg.card4;
      this.room!.state.card5 = msg.card5;
      this.setStateCallback({ connected: true, game: this.room!.state, net: this });
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
