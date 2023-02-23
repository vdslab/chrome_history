import React from "react";

export function Home() {
  const colSize = 6;
  const colMax = 12;
  const colPos = `is-${colSize} is-offset-${Math.floor(
    (colMax - colSize) / 2
  )}`;
  return (
    <div className="section">
      <div className="container">
        <div className="block has-text-centered">
          <h2 className="title has-text-link">History Tree</h2>
          <p className="subtitle">自分の履歴をグラフで見る</p>
        </div>

        <div className="columns">
          <div className={`column ${colPos}`}>
            <article className="message is-dark">
              <div className="message-header">
                <p>使い方</p>
              </div>
              <div className="message-body content">
                <h4>今の履歴</h4>
                <p>chromeのウィンドウを開いてからの履歴が描画されます</p>
                <h4>過去の履歴</h4>
                <p>
                  どの期間の履歴を描画するか選択して，履歴を描画することができます
                </p>
                <p>選択できる期間は以下の通りです</p>
                <ul>
                  <li>現在から6時間前まで</li>
                  <li>現在から12時間前まで</li>
                  <li>現在から24時間前まで</li>
                  <li>特定の日付における，0時から24時までの24時間</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
