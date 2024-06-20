import { Controls } from "../Controls";
import { User } from "./User";

export class UserManager {
  static _users = new Map<number, User>();

  static addUser(id: number) {
    if (this._users.has(id)) return this._users.get(id)!;
    const newUser = new User(id);
    for (const [, input] of Controls.controls._controlData) {
      newUser.registerControl(input);
    }
    this._users.set(id, newUser);
    return newUser;
  }
  static getUser(id: number) {
    return this._users.get(id);
  }

  static updateControls() {
    for (const [, user] of this._users) {
      user.clearControls();
      for (const [, input] of Controls.controls._controlData) {
        user.registerControl(input);
      }
    }
  }
}
