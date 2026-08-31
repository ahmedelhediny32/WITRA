export type Bindings = {
  DB: D1Database;
};

export type UserType = "witra" | "client";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  user_type: UserType;
  role: string;
  client_id: string | null;
  assigned_clients: string[];
  avatar_image: string | null;
  active: number;
};

export type SessionInfo = {
  token: string;
  user: SessionUser;
  impersonating_client_id: string | null;
};
