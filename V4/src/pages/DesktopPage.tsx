import { Link } from 'react-router-dom';
import { Panel } from '../components/UI';
import { useGameState } from '../game/state';

export default function DesktopPage() {
  const { setPhase } = useGameState();

  return (
    <div className="grid-3">
      <Panel title="微信网页版">
        <div className="chat-block">
          <p>林浩（2024-03-10 22:31）：你到底怎么了。</p>
          <p>林浩（2024-03-01 18:07）：都快两个月了。你还好吗。</p>
          <p>林浩（2024-02-25 09:14）：晓，在吗？</p>
          <hr />
          <p>林晓（2024-01-09 02:34）：明天去了，不用担心我。</p>
          <p>林浩（2024-01-09 09:02）：到了记得报平安。</p>
          <p>林晓（2024-01-09 09:15）：好。</p>
        </div>
      </Panel>

      <Panel title="邮件客户端（已打开）">
        <p>发件人：service@tranquil-sleep.com</p>
        <p>收件时间：2024-03-21 02:47</p>
        <p>主题：关于患者林晓的诊疗进度更新</p>
        <p className="muted">
          林晓女士目前正处于深度康复阶段，各项生理指标均在预期范围内。
        </p>
        <Link
          className="button-link"
          to="/clinic"
          onClick={() => {
            setPhase(1);
          }}
        >
          打开 tranquil-sleep.com
        </Link>
      </Panel>

      <Panel title="晓的照片（6张）">
        <ul>
          <li>路边摊合影，眼下有很深阴影</li>
          <li>03:47 时钟截图，仅一个句号</li>
          <li>诊所宣传折页：“这个好像不错”</li>
          <li>“贵不贵？我帮你出”</li>
          <li>“不用，我自己来。”</li>
          <li>“到了记得告诉我”（已送达）</li>
        </ul>
      </Panel>
    </div>
  );
}
