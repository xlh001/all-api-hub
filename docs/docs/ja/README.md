---
home: true
title: "ホーム"
heroImage: "/512.png"
heroText: "All API Hub - あなたの万能 AI 資産マネージャー"
tagline: "オープンソースのブラウザ拡張機能。サードパーティ製AI集約中継ステーションと自社構築のNew APIを一元管理。アカウントの自動認識、モデル価格の比較、API/CLI互換性の検証、モデルとチャネルの同期をサポートし、クロスプラットフォームと暗号化されたWebDAVバックアップに対応。"
actions:
  - text: "利用開始"
    link: "./get-started.html"
    type: "primary"
    
  - text: "Chrome ウェブストア"
    link: "https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo"
    type: "secondary"

  - text: "Edge アドオン"
    link: "https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa"
    type: "secondary"

  - text: "FireFox アドオン"
    link: "https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}"
    type: "secondary"
    
  - text: "Safari インストール"
    link: "./safari-install.html"
    type: "secondary"

features:
  - title: "📦 資産の一元管理ボード"
    details: "複数のサイトとアカウントを1つのパネルに集約。残高、使用量、健全状態を一目で確認でき、スマートなアドレス認識で簡単に追加できます。"
  - title: "🏷️ 独立した API 資格情報"
    details: "サイトアカウントがなくても、Base URL + Key を直接保存可能。タグ分けに対応し、モデル確認やインターフェース検証も可能です。"
  - title: "💰 モデル価格の比較"
    details: "各サイトのモデル価格を実際のコストで比較。最適なグループを自動的に特定し、最もお得な利用ルートを提案します。"
  - title: "✅ 高度なインターフェース検証"
    details: "モデルの可用性、トークン互換性、CLI プロキシの接続性を一括テスト。「サイトは通るがツールでエラーが出る」問題を簡単に解決します。"
  - title: "📈 詳細な使用量統計"
    details: "日付、アカウント、モデルごとに使用量と費用を分析。ヒートマップ、遅延ビュー、低速リクエスト分析を提供します。"
  - title: "📅 自動チェックイン補助"
    details: "サインイン対応サイトを集中管理。自動スケジュールサインイン、カスタム URL 遷移、チャージ/交換ページへの誘導をサポートします。"
  - title: "🚀 迅速なエコシステム統合"
    details: "CherryStudio、CC Switch、Kilo Code 等へ秒速同期。またはアカウント情報を自社構築の管理バックエンドに直接プッシュできます。"
  - title: "🛠️ 自社構築サイト連携"
    details: "New API、AxonHub、Claude Code Hub 等に深く対応。チャネル管理やモデル同期、リダイレクト設定が可能です。"
  - title: "🔒 プライバシーと安全な同期"
    details: "ローカル保存を基本とし、暗号化 WebDAV 同期をサポート。Cloudflare のチャレンジにも自動的に対応して盾を越えます。"

footer: "AGPL-3.0 Licensed | Copyright 2025-present All API Hub"
---

## 紹介

現在、AIエコシステムにはNew APIシリーズに基づいた集約中継ステーションや自社構築パネルが増加しており、各サイトの残高、使用量、モデル価格、APIキーの可用性を同時に管理することは、分散的で時間がかかることがよくあります。

All API Hubはブラウザ拡張機能として、これらのサイトのアカウントを自動認識し、ワンクリックで残高、使用量、モデル価格を確認、モデルとキーを管理、自動サインインを行います。また、独立したAPI認証情報管理をサポートし、自社構築のNew API、DoneHub、Veloera、Octopus、AxonHub、およびClaude Code Hubインスタンスに対してバックエンド連携とチャネル関連ツールを提供します。

## 🎯 使用シーン

あなたの役割やニーズに合わせて、最適なドキュメントを見つけてください：

### AI ツールの利用者
- **クイックスタート**: [拡張機能のインストール](./get-started.md) -> [最初のアカウントを追加](./get-started.md#3-サイトの追加)
- **資産管理**: [残高履歴を確認](./balance-history.md) -> [使用量を分析](./usage-analytics.md)
- **コスト削減**: [クロスサイトでの価格比較](./model-list.md) -> [自動サインインで額度獲得](./auto-checkin.md)
- **一括エクスポート**: [CherryStudio / CC Switch との同期](./get-started.md#4-クイックエクスポートと統合)

### 独立した API キーを多数お持ちの方
- **資格情報管理**: [URL+Key を独立した資格情報として保存](./api-credential-profiles.md)
- **可用性テスト**: [インターフェースと CLI の互換性を一括検証](./web-ai-api-check.md)
- **ブックマーク整理**: [ドキュメントや交換ページを一元管理](./bookmark-management.md)

### 自社構築サイト（New API 等）の管理者
- **効率化ツール**: [拡張機能内でチャネルを管理](./self-hosted-site-management.md) -> [モデルの一括同期](./managed-site-model-sync.md)
- **設定の最適化**: [モデルリダイレクトの設定](./model-redirect.md)
- **セキュリティ**: [2FA / OTP 検証の処理](./new-api-security-verification.md)

---

## サポートされているサイトシステム

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [AxonHub](https://github.com/looplj/axonhub)
- [Sub2API](https://github.com/Wei-Shaw/sub2api)
- [AnyRouter](https://anyrouter.top)
- WONG公益站
- Neo-API（クローズドソース）
- Super-API（クローズドソース）
- RIX_API（クローズドソース、基本機能サポート）
- VoAPI（クローズドソース、旧バージョンサポート）

macOSでSafari経由で拡張機能を使用する場合は、まず[Safariインストールガイド](./safari-install.md)を確認してください。SafariはXcode経由でインストールする必要があります。これは、Chrome/Edge/Firefoxのストアインストールや解凍ロードとは異なる方法です。

もしQQブラウザ、360セキュアブラウザ、360クイックブラウザ、Cheetahブラウザ、Brave、Vivaldi、Operaなどのブラウザを使用している場合は、[QQ/360等ブラウザインストールガイド](./other-browser-install.md)を確認してください。

<a id="community"></a>
## 💬 コミュニティ交流

使用に関する問題の迅速なコミュニケーション、設定のトラブルシューティング、互換性のあるサイトの共有を行いたい場合は、以下のコミュニティチャネルの利用をお勧めします。

- [GitHub Discussions](https://github.com/qixing-jk/all-api-hub/discussions)：問題の整理、経験の蓄積、長期的な議論に適しています。
- [Discord コミュニティ](https://discord.gg/RmFXZ577ZQ)：多言語ユーザー向けで、機能が豊富、議論や問題解決に適しています。
- [Telegram グループ](https://t.me/qixing_chat)：多言語ユーザー間の迅速なコミュニケーションに適しています。
- WeChatグループ：以下のQRコードをスキャンして、中国語の交流グループに参加してください。

<img
  src="../../../resources/wechat_group.png"
  alt="All API Hub WeChatグループQRコード"
  style="width: min(280px, 100%);"
/>
