import { Schema, type } from "@colyseus/schema";

export class PokerPlayer extends Schema {
  @type("boolean")
  isSeated: boolean = false;

  @type("boolean")
  isFolded: boolean;

  @type("string")
  name: string = "";

  @type("string")
  clientID: string = "";

  @type("string")
  card1: string = "EM";

  @type("string")
  card2: string = "EM";

  @type("number")
  chips: number = 200;

  @type("number")
  bet: number = 0;
}
