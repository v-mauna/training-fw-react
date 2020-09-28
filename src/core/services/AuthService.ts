import Axios from 'axios';
import { IdentityService } from './IdentityService';

export class AuthService {
  private static instance: AuthService | undefined;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string): Promise<boolean> {
    const url = `${process.env.REACT_APP_DATA_SERVICE}/login`;
    const { data } = await Axios.post(url, { username, password });

    if (!data.success) return false;

    IdentityService.getInstance().set(data.user, data.token);
    return true;
  }

  async logout(): Promise<void> {
    const url = `${process.env.REACT_APP_DATA_SERVICE}/logout`;
    await Axios.post(url);
    IdentityService.getInstance().clear();
  }
}
