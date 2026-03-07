import type { GameState } from './types';

export function canAttemptOALogin(state: GameState): { ok: boolean; reason?: string } {
  if (!state.discoveredFacts.has('oa_url_discovered')) {
    return { ok: false, reason: '系统连接超时。请检查网络配置。' };
  }
  if (!state.discoveredFacts.has('employee_8023_known')) {
    return { ok: false, reason: '账号不存在或已被禁用。' };
  }
  return { ok: true };
}

export function attemptOALogin(
  state: GameState,
  username: string,
  password: string
): { success: boolean; message: string } {
  const gate = canAttemptOALogin(state);
  if (!gate.ok) {
    return { success: false, message: gate.reason ?? '连接失败。' };
  }
  if (username === '8023' && password === 'fswltz') {
    return { success: true, message: '登录成功。' };
  }
  return { success: false, message: '用户名或密码错误。' };
}

export function canTriggerEnding(state: GameState): boolean {
  return (
    state.discoveredFacts.has('password_half_juku_found') &&
    state.discoveredFacts.has('linyuudon_message_found')
  );
}

export function canAccessAdminPanel(state: GameState): {
  ok: boolean;
  reason?: string;
} {
  if (!state.discoveredFacts.has('forum_url_discovered')) {
    return { ok: false, reason: '会话状态异常，请稍后重试。' };
  }
  if (!state.discoveredFacts.has('employee_8023_known')) {
    return { ok: false, reason: '会话状态异常，请稍后重试。' };
  }
  if (!state.discoveredFacts.has('oa_maintenance_log_read')) {
    return { ok: false, reason: '密码正确，但您的会话状态异常，请重新登录。' };
  }
  return { ok: true };
}
