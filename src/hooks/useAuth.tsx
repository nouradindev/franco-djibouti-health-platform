import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  roles: AppRole[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const withTimeout = async <T,>(p: Promise<T>, ms: number, label: string): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    });

    try {
      return await Promise.race([p, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) console.error("fetchProfile error:", error);
    setProfile(data);
    return data;
  };

  // RBAC via RPC instead of querying `user_roles` directly.
  // This avoids potential RLS/policy evaluation issues that can cause timeouts.
  const fetchRolesViaRpc = async (userId: string) => {
    const callHasRole = async (role: AppRole) => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: role,
      });
      if (error) console.error(`has_role(${role}) error:`, error);
      return Boolean(data);
    };

    const [superAdmin, admin, editor] = await Promise.all([
      withTimeout(callHasRole("super_admin"), 10000, "has_role(super_admin)"),
      withTimeout(callHasRole("admin"), 10000, "has_role(admin)"),
      withTimeout(callHasRole("editor"), 10000, "has_role(editor)"),
    ]);

    const nextRoles: AppRole[] = [];
    if (superAdmin) nextRoles.push("super_admin");
    if (admin) nextRoles.push("admin");
    if (editor) nextRoles.push("editor");
    setRoles(nextRoles);
    return nextRoles;
  };

  const fetchRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (error) console.error("fetchRoles error:", error);
    const nextRoles = data?.map((r) => r.role) || [];
    setRoles(nextRoles);
    return nextRoles;
  };

  useEffect(() => {
    const syncFromSession = async (nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setProfile(null);
        setRoles([]);
        setIsLoading(false);
        return;
      }

      // Ensure roles are loaded before route guards decide.
      const userId = nextSession.user.id;
      try {
        setIsLoading(true);

        // Profile is not needed for authorization; do not block admin access on it.
        // Still try to load it, but in a best-effort way.
        withTimeout(fetchProfile(userId), 10000, "fetchProfile").catch((e) => {
          console.error("profilePromise error:", e);
          setProfile(null);
        });

        // Authorization must complete (or timeout) so guards can decide.
        await fetchRolesViaRpc(userId);
      } catch (e) {
        // Errors are handled by each promise catch.
        console.error("syncFromSession error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        await syncFromSession(nextSession);
      },
    );

    (async () => {
      const { data: { session: nextSession } } = await supabase.auth.getSession();
      await syncFromSession(nextSession);
    })();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
  };

  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.some((r) => ["super_admin", "admin", "editor"].includes(r));

  return (
    <AuthContext.Provider value={{ session, user, profile, roles, isLoading, isSuperAdmin, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
