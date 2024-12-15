import { firebaseAuth } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { signOut } from 'firebase/auth';

export const signOutAction = defineAction({
  accept: 'json',
  async handler() {
    return signOut(firebaseAuth);
  }
});
