import { Schema, type } from "@colyseus/schema";

export class PokerPlayer extends Schema {
  @type("boolean")
  isSeated: boolean = true;

  @type("string")
  name: string = "";

  @type("string")
  clientID: string = "";

  @type("string")
  card1: string = "Qh";

  @type("string")
  card2: string = "Kh";

  @type("number")
  chips: number = 120;

  @type("number")
  bet: number = 0;
}
