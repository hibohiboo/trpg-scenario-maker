import { ScenarioPage as Scenario } from '@/entities/scenario';

export function ScenarioPage() {
  return (
    <>
      <Scenario />
      <p className="pt-5">
        サンプルデータは
        <a
          href="https://transmitter.booth.pm/items/953844"
          className="text-blue-900"
          target="_blank"
        >
          トーキョーN◎VA 自作シナリオ入門書
        </a>
        を参考にさせていただきました。
      </p>
      <p>
        キャラクター画像のサンプルは
        <a
          href="https://cotoraya.booth.pm/items/2153988"
          className="text-blue-900"
          target="_blank"
        >
          エルフさんフリー素材
        </a>
        を利用させていただきました
      </p>
    </>
  );
}
