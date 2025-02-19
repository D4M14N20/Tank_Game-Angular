export enum argNames{
  connect = 0,
  playerID = 1,
  playerPosition,
  playerVelocity,
  playerXp,
  playerHp,
}
export class Packet{
  arg : argNames;
  value : object;
  constructor(arg: argNames, value: object) {
    this.arg = arg;
    this.value = value;
  }
}
export class Client{
  //packet: []
  send(){

  }
}
