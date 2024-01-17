import { useEffect, useReducer, useCallback, useMemo, useState } from "react";
import { ActionMapType, AuthStateType } from "../types";
import { AuthContext } from "./auth-context";
import { useSnackbar } from "notistack";
import { Session, User, createClient } from "@supabase/supabase-js";

enum Types {
  INITIAL = "INITIAL",
}

type Payload = {
  [Types.INITIAL]: {
    user: User | null;
  };
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: Action) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  return state;
};

type Props = {
  children: React.ReactNode;
};

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL ?? "",
  process.env.REACT_APP_SUPABASE_ANON_KEY ?? ""
);

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const snackBar = useSnackbar();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: session?.user ?? null,
        },
      });
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: session?.user ?? null,
        },
      });
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        snackBar.enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [snackBar]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      snackBar.enqueueSnackbar(error.message, { variant: "error" });
    }
  }, [snackBar]);

  const signup = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        snackBar.enqueueSnackbar(error.message, { variant: "error" });
      }
    },
    [snackBar]
  );

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      snackBar.enqueueSnackbar(error.message, { variant: "error" });
    }
  }, []);

  const value = useMemo(
    () => ({
      session: session,
      loading: state.loading,
      authenticated: !!state.user,
      user: state.user,
      login,
      logout,
      signup,
      loginWithGoogle,
    }),
    [login, logout, signup, loginWithGoogle, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
