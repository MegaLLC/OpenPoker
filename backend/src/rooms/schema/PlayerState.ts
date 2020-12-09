import { Schema, type, filter } from "@colyseus/schema";
import { nosync } from "colyseus";

export class PokerPlayer extends Schema {
  @type("boolean")
  isSeated: boolean = false;

  @type("boolean")
  isFolded: boolean;

  @type("string")
  name: string = "";

  @type("string")
  clientID: string = "";

  @nosync
  card1: string = "EM";

  @nosync
  card2: string = "EM";

  @type("number")
  chips: number = 2000;

  @type("number")
  bet: number = 0;
}
