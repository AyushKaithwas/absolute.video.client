// ----------------------------------------------------------------------

import { AuthError, Session, User } from "@supabase/supabase-js";

export type ActionMapType<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: User | null;
};

// ----------------------------------------------------------------------

export type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<AuthError | null>;
  signup: (email: string, password: string) => Promise<AuthError | null>;
  loginWithGoogle: () => Promise<AuthError | null>;
  logout: () => Promise<AuthError | null>;
};

// ----------------------------------------------------------------------
