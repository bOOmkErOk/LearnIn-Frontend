import { LoginResponse } from '../../core/models/auth.models';

export class SetAuthData {
  static readonly type = '[Auth] Set Auth Data';
  constructor(public payload: LoginResponse) { }
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
