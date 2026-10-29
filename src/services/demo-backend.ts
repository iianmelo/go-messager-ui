export interface DemoUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export interface DemoMessage {
  receiverId: number;
  senderId: number;
  name: string;
  text: string;
  time: string;
}

export interface DemoChat {
  id: number;
  user_id: number;
  user: DemoUser;
  receiver_id: number;
  receiver: DemoUser;
  messages: DemoMessage[];
  created_at: string;
  updated_at: string;
}

interface DemoState {
  user: DemoUser;
  contacts: DemoUser[];
  chats: DemoChat[];
}

const STORAGE_KEY = "go-message-demo";

function at(iso: string): string {
  return iso;
}

function user(
  id: number,
  name: string,
  email: string,
): DemoUser {
  return {
    id,
    name,
    email,
    avatar: "",
    created_at: at("2024-11-04T12:00:00.000Z"),
    updated_at: at("2024-12-02T18:00:00.000Z"),
  };
}

export function seedDemoState(): DemoState {
  const ana = user(1, "Ana Bezerra", "ana.bezerra@cin.ufpe.br");
  const carlos = user(2, "Carlos Lima", "carlos.lima@cin.ufpe.br");
  const mariana = user(3, "Mariana Souza", "mariana.souza@cin.ufpe.br");
  const joao = user(4, "João Victor Rocha", "joao.rocha@cin.ufpe.br");
  const pedro = user(5, "Pedro Alves", "pedro.alves@cin.ufpe.br");
  const beatriz = user(6, "Beatriz Nunes", "beatriz.nunes@cin.ufpe.br");

  const chats: DemoChat[] = [
    {
      id: 41,
      user_id: ana.id,
      user: ana,
      receiver_id: joao.id,
      receiver: joao,
      created_at: at("2024-11-20T13:00:00.000Z"),
      updated_at: at("2024-12-06T15:40:00.000Z"),
      messages: [
        {
          senderId: joao.id,
          receiverId: ana.id,
          name: joao.name,
          text: "Ana, a apresentação de ESS ficou para sexta, no CIn.",
          time: "2024-12-06T15:12:00.000Z",
        },
        {
          senderId: ana.id,
          receiverId: joao.id,
          name: ana.name,
          text: "Pode ser. Eu mostro o front e o fluxo de login.",
          time: "2024-12-06T15:18:00.000Z",
        },
        {
          senderId: joao.id,
          receiverId: ana.id,
          name: joao.name,
          text: "Eu levo o roteiro da API em Go e o modelo do Postgres.",
          time: "2024-12-06T15:40:00.000Z",
        },
      ],
    },
    {
      id: 38,
      user_id: ana.id,
      user: ana,
      receiver_id: carlos.id,
      receiver: carlos,
      created_at: at("2024-11-18T13:00:00.000Z"),
      updated_at: at("2024-12-05T19:05:00.000Z"),
      messages: [
        {
          senderId: carlos.id,
          receiverId: ana.id,
          name: carlos.name,
          text: "O serviço da API no Render está suspenso.",
          time: "2024-12-05T18:40:00.000Z",
        },
        {
          senderId: ana.id,
          receiverId: carlos.id,
          name: ana.name,
          text: "Sem o backend, o front abre com os dados de demonstração.",
          time: "2024-12-05T18:52:00.000Z",
        },
        {
          senderId: carlos.id,
          receiverId: ana.id,
          name: carlos.name,
          text: "Assim a banca vê as conversas mesmo sem o Firebase.",
          time: "2024-12-05T19:05:00.000Z",
        },
      ],
    },
    {
      id: 33,
      user_id: ana.id,
      user: ana,
      receiver_id: mariana.id,
      receiver: mariana,
      created_at: at("2024-11-12T13:00:00.000Z"),
      updated_at: at("2024-12-04T11:20:00.000Z"),
      messages: [
        {
          senderId: mariana.id,
          receiverId: ana.id,
          name: mariana.name,
          text: "Conseguiu autenticar no Firebase?",
          time: "2024-12-04T11:02:00.000Z",
        },
        {
          senderId: ana.id,
          receiverId: mariana.id,
          name: ana.name,
          text: "O login chama POST /auth e guarda o token.",
          time: "2024-12-04T11:11:00.000Z",
        },
        {
          senderId: mariana.id,
          receiverId: ana.id,
          name: mariana.name,
          text: "Beleza. O Postgres fica só no serviço em Go.",
          time: "2024-12-04T11:20:00.000Z",
        },
      ],
    },
    {
      id: 29,
      user_id: ana.id,
      user: ana,
      receiver_id: pedro.id,
      receiver: pedro,
      created_at: at("2024-11-08T13:00:00.000Z"),
      updated_at: at("2024-12-03T09:15:00.000Z"),
      messages: [
        {
          senderId: pedro.id,
          receiverId: ana.id,
          name: pedro.name,
          text: "Vou revisar o texto da arquitetura antes da entrega.",
          time: "2024-12-03T09:04:00.000Z",
        },
        {
          senderId: ana.id,
          receiverId: pedro.id,
          name: ana.name,
          text: "Deixei o diagrama com Next, Fiber, Firebase e Postgres.",
          time: "2024-12-03T09:15:00.000Z",
        },
      ],
    },
  ];

  return {
    user: ana,
    contacts: [carlos, mariana, joao, pedro, beatriz],
    chats,
  };
}

function loadState(): DemoState {
  if (typeof window === "undefined") return seedDemoState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = seedDemoState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw) as DemoState;
  } catch {
    return seedDemoState();
  }
}

function saveState(state: DemoState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pathnameOf(url: string | undefined, baseURL: string | undefined): string {
  const raw = url || "";
  try {
    const combined = raw.startsWith("http")
      ? raw
      : `${(baseURL || "http://local").replace(/\/$/, "")}/${raw.replace(/^\//, "")}`;
    const parsed = new URL(combined, "http://local");
    return parsed.pathname.replace(/\/$/, "") || "/";
  } catch {
    return raw.split("?")[0].replace(/\/$/, "") || "/";
  }
}

function readBody(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (data && typeof data === "object") return data as Record<string, unknown>;
  return {};
}

export function handleDemoRequest(
  method: string,
  url: string | undefined,
  baseURL: string | undefined,
  data: unknown,
): { status: number; data: unknown } {
  const path = pathnameOf(url, baseURL);
  const verb = method.toLowerCase();
  const body = readBody(data);
  const state = loadState();

  if (verb === "post" && path.endsWith("/auth/sign-up")) {
    const name = String(body.name || state.user.name);
    const email = String(body.email || state.user.email);
    const photo = typeof body.photo_url === "string" ? body.photo_url : state.user.avatar;
    state.user = { ...state.user, name, email, avatar: photo };
    saveState(state);
    return { status: 201, data: { user: state.user } };
  }

  if (verb === "post" && path.endsWith("/auth")) {
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    if (!email || !password) {
      return { status: 400, data: { error: "E-mail e senha são obrigatórios" } };
    }
    return {
      status: 200,
      data: {
        token: "demo-token",
        user: { name: state.user.name, email: state.user.email, avatar: state.user.avatar },
      },
    };
  }

  if (verb === "post" && path.endsWith("/resetpassword")) {
    return { status: 200, data: { ok: true } };
  }

  if (verb === "get" && path.endsWith("/users/all")) {
    return { status: 200, data: state.contacts };
  }

  if (verb === "patch" && path.endsWith("/users")) {
    const name = typeof body.name === "string" ? body.name : state.user.name;
    const photo = body.photo ?? body.avatar;
    const avatar = typeof photo === "string" ? photo : state.user.avatar;
    state.user = { ...state.user, name, avatar };
    state.chats = state.chats.map((chat) => ({
      ...chat,
      user: chat.user.id === state.user.id ? state.user : chat.user,
    }));
    saveState(state);
    return { status: 200, data: state.user };
  }

  if (verb === "get" && path.endsWith("/users")) {
    return { status: 200, data: state.user };
  }

  if (verb === "get" && path.endsWith("/chats/user")) {
    return { status: 200, data: state.chats };
  }

  return { status: 404, data: { error: `Rota de demonstração não encontrada: ${path}` } };
}
