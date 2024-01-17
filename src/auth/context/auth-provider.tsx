import {
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
  useContext,
} from "react";
import { ActionMapType, AuthStateType } from "../types";
import { AuthContext } from "./auth-context";
import { Session, User, createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

enum Types {
  INITIAL = "INITIAL",
}

type Payload = {
  [Types.INITIAL]: {
    user: User | null;
  };
};

export const useAuth = () => {
  return useContext(AuthContext);
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
  const { toast } = useToast();
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
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return error;
    },
    [toast]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    return error;
  }, [toast]);

  const signup = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return error;
    },

    [toast]
  );

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    return error;
  }, [toast]);

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
    [session, state.loading, state.user, login, logout, signup, loginWithGoogle]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
