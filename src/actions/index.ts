import { signOutAction } from '@/actions/auth/logout.action';
import { registerAction } from '@/actions/auth/register.action';

export const server = {
  register: registerAction,
  signOut: signOutAction
};
