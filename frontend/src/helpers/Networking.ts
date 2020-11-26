import { Client, Room } from "colyseus.js";

export class Network {
  client: Client;
  room: Room | undefined;
  seat: number = 0;

  constructor(setStateCallback) {
    this.client = new Client("ws://localhost:2567");

    this.client.joinOrCreate("main").then((room) => {
      this.room = room;
      room.onStateChange((state) => {
        setStateCallback({ game: room.state, net: this });
      });
    });
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
