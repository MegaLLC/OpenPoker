import { Schema, type } from "@colyseus/schema";

export class PokerPlayer extends Schema {
  @type("boolean")
  isSeated: boolean = false;

  @type("string")
  name: string = "";

  @type("string")
  card1: string = "QH";

  @type("string")
  card2: string = "KH";

  @type("number")
  chips: number = 120;

  @type("number")
  bet: number = 3;
}
