import { Schema, SetSchema, type } from "@colyseus/schema";

// TODO make sure when 2 players with same stack size in a threeway all in works

export class PotState extends Schema {
  @type("number")
  chips: number = 0;

  @type({ set: "number" })
  players = new SetSchema<number>();
}
