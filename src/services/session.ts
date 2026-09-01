const SESSION_KEY = 'agentcart-session-id';
const USER_KEY = 'agentcart-user-id';

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

function generateSessionId(): string {
  return `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const demoSession = {
  getSessionId(): string {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  },

  getUserId(): string {
    let id = localStorage.getItem(USER_KEY);
    if (!id) {
      id = DEFAULT_USER_ID;
      localStorage.setItem(USER_KEY, id);
    }
    return id;
  },

  reset(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getHeaders(): Record<string, string> {
    return {
      'x-agentcart-session-id': this.getSessionId(),
      'x-agentcart-user-id': this.getUserId(),
    };
  },
};
