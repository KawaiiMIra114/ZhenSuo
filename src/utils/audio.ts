/**
 * AudioManager · V4 音效系统
 * GDD §2.6 音效设计规范
 *
 * === 音效文件放置指南 ===
 * 所有音效文件放入: public/sounds/
 *
 * 文件清单：
 * ┌─────────────────────┬────────┬──────────────────────────────────────┐
 * │ 文件名              │ 格式   │ 用途                                 │
 * ├─────────────────────┼────────┼──────────────────────────────────────┤
 * │ tape_click.mp3      │ .mp3   │ InvestigateNode 点击 — 极轻微磁带声 │
 * │ glitch_short.mp3    │ .mp3   │ 结局A邮件窗口弹出 — 短促电子杂音    │
 * │ breath_exhale.mp3   │ .mp3   │ 结局C节点释放 — 极微弱人声呼气      │
 * │ wechat_notify.mp3   │ .mp3   │ 结局C最终 — 微信消息提示音          │
 * └─────────────────────┴────────┴──────────────────────────────────────┘
 *
 * 以下音效由程序生成，不需要文件：
 * - Logo凝视警告 2000Hz 高频刺激音 0.5s
 * - 管理员面板 25Hz 低频底噪
 */

type SoundName = 'tape_click' | 'glitch_short' | 'breath_exhale' | 'wechat_notify';

class AudioManager {
    private ctx: AudioContext | null = null;
    private buffers: Map<SoundName, AudioBuffer> = new Map();
    private loaded = false;
    private muted = false;

    private getContext(): AudioContext {
        if (!this.ctx) {
            this.ctx = new AudioContext();
        }
        return this.ctx;
    }

    /** 预加载所有音效文件 */
    async loadAll() {
        if (this.loaded) return;
        const files: Record<SoundName, string> = {
            tape_click: '/sounds/tape_click.mp3',
            glitch_short: '/sounds/glitch_short.mp3',
            breath_exhale: '/sounds/breath_exhale.mp3',
            wechat_notify: '/sounds/wechat_notify.mp3',
        };

        for (const [name, url] of Object.entries(files)) {
            try {
                const res = await fetch(import.meta.env.BASE_URL + url.slice(1));
                if (!res.ok) continue;
                const buf = await res.arrayBuffer();
                const decoded = await this.getContext().decodeAudioData(buf);
                this.buffers.set(name as SoundName, decoded);
            } catch {
                // 音效文件不存在时静默跳过
            }
        }
        this.loaded = true;
    }

    /** 播放预加载音效 */
    play(name: SoundName, volume = 1.0) {
        if (this.muted) return;
        const buffer = this.buffers.get(name);
        if (!buffer) return;
        const ctx = this.getContext();
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        gain.gain.value = Math.min(volume, 1);
        source.connect(gain).connect(ctx.destination);
        source.start();
    }

    /** 程序化生成纯音（Logo 警告、管理员底噪等） */
    playTone(freq: number, durationSec: number, volume = 0.3) {
        if (this.muted) return;
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.value = Math.min(volume, 1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + durationSec);
    }

    /** GDD §2.6: Logo凝视 2000Hz 高频刺激音 0.5s */
    playLogoWarning() {
        this.playTone(2000, 0.5, 0.4);
    }

    /** GDD §2.6: 管理员面板低频底噪 25Hz */
    playAdminDrone() {
        this.playTone(25, 60, 0.05);
    }

    /** 静音切换 */
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }
}

export const audio = new AudioManager();
