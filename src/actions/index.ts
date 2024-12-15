import { googleSignInAction } from '@/actions/auth/google-sign-in.action';
import { loginAction } from '@/actions/auth/login.action';
import { signOutAction } from '@/actions/auth/logout.action';
import { registerAction } from '@/actions/auth/register.action';

export const server = {
  register: registerAction,
  signOut: signOutAction,
  login: loginAction,
  googleSignIn: googleSignInAction
};
