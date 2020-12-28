import { Client, Room } from "colyseus.js";
import { toast } from "react-toastify";

export class Network {
  client: Client;
  room: Room | undefined;
  connected = false;
  seat: number = 0;
  setStateCallback: any;
  pastSession: string | undefined;

  constructor(setStateCallback) {
    this.client = new Client("ws://localhost:2567");
    this.setStateCallback = setStateCallback;
  }

  onJoin(room) {
    this.room = room;
    this.pastSession = room.sessionId;
    room.onStateChange((state) => {
      this.setStateCallback({ game: room.state, net: this });
    });

    room.onLeave(() => {
      this.room = undefined;
      this.connected = false;
      this.setStateCallback({ net: this });
    });

    this.room!.onMessage("end_hand", (msg) => {
      const winnerCount = msg.length;

      const players = this.room!.state.players;
      let winnerName = "";
      if (winnerCount > 2) {
        const playerNames: string[] = msg.map((seatNumber) => players[seatNumber].name);
        winnerName = playerNames.slice(1).join(", ");
        winnerName += " and " + playerNames[0];
        winnerName += " have";
      } else if (winnerCount === 2) {
        winnerName = `${players[msg[0]].name} and ${players[msg[1]].name}`;
        winnerName += " have";
      } else {
        winnerName = players[msg[0]].name + " has";
      }
      let winnerMsg = winnerName + " won the hand 🚀";

      toast.info(winnerMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    this.room!.onMessage("hands", (msg) => {
      for (let i = 0; i < msg.length; i++) {
        const playerCards = msg[i];
        this.room!.state.players[i].card1 = playerCards[0];
        this.room!.state.players[i].card2 = playerCards[1];
      }
      this.setStateCallback({ game: this.room!.state, net: this });
    });

    this.room!.onMessage("board", (msg) => {
      this.room!.state.card1 = msg.card1;
      this.room!.state.card2 = msg.card2;
      this.room!.state.card3 = msg.card3;
      this.room!.state.card4 = msg.card4;
      this.room!.state.card5 = msg.card5;
      this.setStateCallback({ game: this.room!.state, net: this });
    });
  }

  connect() {
    this.client
      .joinOrCreate("main")
      .then((room) => this.onJoin(room))
      // success
      .then(() => {
        console.log("connected");
        this.connected = true;
      })
      // can't connect
      .catch((error) => {
        this.connected = false;
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
