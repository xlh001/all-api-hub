# はじめに

New API などの AI 中継ステーションアカウントの管理体験を最適化するために設計された、オープンソースのブラウザ拡張機能です。ユーザーは、アカウント残高、モデル、キーを一元的に管理・表示し、新しいサイトを自動的に追加できます。原則として、ブラウザが拡張機能をサポートしていれば、通常はモバイルデバイスでも使用できます。

## 1. ダウンロード

### チャネルバージョンの比較

| チャネル | ダウンロードリンク | 現在のバージョン | ユーザー数 |
|---|---|---|---|
| Chrome ウェブストア | [Chrome ウェブストア](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome version](https://img.shields.io/chrome-web-store/v/lapnciffpekdengooeolaienkeoilfeo?label=Chrome&logo=googlechrome&style=flat)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) | [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/lapnciffpekdengooeolaienkeoilfeo?label=Chrome%20Users)](https://chromewebstore.google.com/detail/lapnciffpekdengooeolaienkeoilfeo) |
| Edge ウェブストア | [Edge ウェブストア](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge version](https://img.shields.io/badge/dynamic/json?label=Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpcokpjaffghgipcgjhapgdpeddlhblaa&logo=microsoftedge&style=flat)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) | [![Edge Add-ons Users](https://img.shields.io/badge/dynamic/json?label=Edge%20Users&query=$.activeInstallCount&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/pcokpjaffghgipcgjhapgdpeddlhblaa)](https://microsoftedge.microsoft.com/addons/detail/pcokpjaffghgipcgjhapgdpeddlhblaa) |
| Firefox ウェブストア | [Firefox ウェブストア](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Firefox version](https://img.shields.io/amo/v/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox&logo=firefoxbrowser&style=flat)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) | [![Mozilla Add-on Users](https://img.shields.io/amo/users/%7Bbc73541a-133d-4b50-b261-36ea20df0d24%7D?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/{bc73541a-133d-4b50-b261-36ea20df0d24}) |
| GitHub Releases | [すべてのリリースを見る](https://github.com/qixing-jk/all-api-hub/releases) | [![GitHub version](https://img.shields.io/github/v/release/qixing-jk/all-api-hub?label=GitHub&logo=github&style=flat)](https://github.com/qixing-jk/all-api-hub/releases/latest) | [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/qixing-jk/all-api-hub/total?label=Total%20Downloads)](https://github.com/qixing-jk/all-api-hub/releases) |

::: tip ストア版と Release 版の違い
- デフォルトではストア版の使用を推奨します。
- ストア版はほとんどのユーザーに適しており、インストールが簡単で、通常は自動更新されます。
- Release 版は手動でダウンロード、解凍し、更新後に再度手動でインストールまたは再読み込みする必要があります。
- 新しいバージョンをより早く取得したい、手動で修正を確認したい、または拡張パッケージをロードする必要がある場合にのみ、Release 版を検討してください。

モバイル / スマートフォンでの補足説明：
- 原則として、ブラウザが拡張機能をサポートしていれば、通常は使用できます。例: `Edge`、`Firefox for Android`、`Kiwi` など。
- 詳細については、[よくある質問のモバイルデバイスでの使用](./faq.md#mobile-browser-support) を参照してください。
:::

<details>
<summary>Release タイプ選択</summary>

まずバージョンタイプを選択し、対応するアタッチメントをダウンロードしてください：

| タイプ | 推奨されるシナリオ | ダウンロードリンク | 特徴 |
|---|---|---|---|
| 正式版 Stable | 日常使用、初回インストール、安定性優先 | [最新の正式版をダウンロード](https://github.com/qixing-jk/all-api-hub/releases/latest) | 正式リリースバージョンに対応しており、リリースノートがより充実しており、安定性が高いです。 |
| Nightly プレリリース | 新機能/修正をいち早く取得したい、または問題の検証に協力したい | [Nightly をダウンロード](https://github.com/qixing-jk/all-api-hub/releases/tag/nightly) | `main` の最新コミットから自動生成されるため、更新が最も速い一方、十分に検証されていない変更を含む場合があります。添付ファイル名には通常 `nightly` が含まれます。 |

::: tip 選択方法
- どちらを選択すべきか不明な場合は、まず正式版 Stable を選択してください。
- 特定の修正が含まれているか確認したい場合、または問題のフィードバックに協力したい場合は、Nightly を選択してください。
- ストア版は通常、審査の遅延により 1～3 日遅れます。GitHub の正式版は一般的に早く、Nightly は最も速いですが、リスクも高くなります。
:::

</details>

### Safari ブラウザのインストール

Safari は、Chrome、Edge、Firefox のようにストアから直接インストールしたり、解凍して読み込んだりすることはできません。Xcode を介してインストールする必要があります。完全な手順については、[Safari インストールガイド](./safari-install.md) を参照してください。

推奨されるインストール方法：

1. GitHub Release から `all-api-hub-<version>-safari-xcode-bundle.zip` をダウンロードし、解凍後に Xcode プロジェクトを直接開いて実行します。

高度な使い方：

1. ソースコードからビルド：`pnpm install` -> `pnpm run build:safari` -> `xcrun safari-web-extension-converter .output/safari-mv2/` -> Xcode で実行します。

::: warning Safari ダウンロードに関する注意事項
`all-api-hub-<version>-safari-xcode-bundle.zip` をダウンロードしてください。`all-api-hub-<version>-safari.zip` を単独でダウンロードしないでください。前者には、直接開くことができる Xcode プロジェクトと実行に必要なファイルが含まれており、通常のインストールプロセスに適しています。
:::

正式な署名を行い、TestFlight / App Store で配布する場合は、通常 Apple Developer Program アカウントも必要です。それ以外の場合は、一般的にローカルデバッグまたは自己使用に適しています。

### QQ / 360 などブラウザのインストール

QQ ブラウザ、360 セキュア ブラウザ、360 スピード ブラウザ、Cheetah ブラウザ、Brave、Vivaldi、Opera などのブラウザを使用している場合は、GitHub Release の Chrome バージョンの圧縮パッケージをダウンロードし、[QQ / 360 などブラウザのインストールガイド](./other-browser-install.md) を参照して解凍・ロードしてください。

## 2. サポートされているサイト

以下のプロジェクトに基づいてデプロイされた中継ステーションをサポートしています：
- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [AxonHub](https://github.com/looplj/axonhub)
- WONG公益站
- [Sub2API](https://github.com/Wei-Shaw/sub2api)
- [AnyRouter](https://anyrouter.top)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)
- Neo-API
- RIX_API（基本機能サポート）

互換性のあるサイトの完全なリストについては、[サポートされているサイトとシステムタイプ](./supported-sites.md) を参照してください。

::: warning
サイトが二次開発され、一部の重要なインターフェース（例: `/api/user`）が変更された場合、拡張機能はこのサイトを正常に追加できない可能性があります。
:::

## 3. サイトの追加

::: info ヒント
拡張機能の自動認識機能がログイン情報を読み取り、アカウント情報を取得できるように、必ず事前にブラウザで対象ウェブサイトにログインしてください。
:::

### 3.1 自動認識による追加

1. 拡張機能のメインページを開き、「`新規アカウント`」をクリックします。

![新規アカウント](../static/image/add-account-btn.png)

2. 中継ステーションのアドレスを入力し、「`自動認識`」をクリックします。

![自動認識](../static/image/add-account-dialog-btn.png)

3. 自動認識が正しいことを確認したら、「`追加を確定`」をクリックします。

::: info ヒント
拡張機能は、アカウントのさまざまな情報を自動的に認識します。例：
- ユーザー名
- ユーザー ID
- [アクセス トークン](#manual-addition)
- チャージ金額の倍率
:::

> 対象サイトで Cloudflare 5 秒ルールが有効になっている場合、拡張機能は自動的に独立したウィンドウを表示して、ルール通過を支援します。通過後、認識プロセスを続行できます。
> IP の品質が低い場合やその他の理由で、タイムアウト前にポップアップウィンドウで手動でルールを通過させる必要がある場合があります。

### 3.2 Cloudflare ルール通過アシスタントの概要

- Cloudflare 5 秒ルールが認識された場合、拡張機能は自動的に一時ウィンドウを起動して検証を完了します。チャレンジに手動介入が必要な場合は、ポップアップウィンドウで検証をクリックしてください。
- 検証が完了すると、元のプロセスに戻り、アクセス トークンとサイト情報の取得を続行します。
- 詳細については、[Cloudflare 保護と一時ウィンドウのダウングレード](#cloudflare-window-downgrade) を参照してください。

<a id="manual-addition"></a>
### 3.3 手動追加

::: info ヒント
自動認識が成功しなかった場合は、サイトアカウントを手動で入力して追加できます。事前に以下の情報を取得する必要があります。（各サイトの UI は異なる場合があるため、ご自身で探してください。）
:::
![ユーザー情報](../static/image/site-user-info.png)

対象サイトがカスタマイズ版（例: AnyRouter）の場合は、アカウントを追加する際に手動で **Cookie モード** に切り替えてから、自動認識または手動入力を実行してください。厳格な保護が施されたサイトに遭遇した場合は、Cloudflare ルール通過アシスタントと組み合わせて使用することもできます。詳細は [よくある質問](./faq.md#anyrouter-error) を参照してください。

<a id="quick-export-sites"></a>
## 4. クイックエクスポートと統合

この拡張機能は、追加されたサイトの API 設定をローカルクライアント、CLI ツール、およびセルフホスト型サイトにエクスポートすることをサポートしており、`Base URL`、キー、モデル設定の繰り返し入力を削減します。現在の完全なリストについては、[サポートされているエクスポートツールと統合ターゲット](./supported-export-tools.md) を参照してください。

### 4.1 設定

エクスポート/統合機能を使用する前に、ターゲットタイプに応じて対応する設定を完了してください：

- **CherryStudio / CC Switch**：Deeplink を介してインポートを呼び出せるように、ターゲットクライアントを起動したままにします。
- **Kilo Code / Roo Code**：各キーに対応するモデル ID を事前に確認することをお勧めします。
- **CLIProxyAPI / Claude Code Router**：基本設定に対応する管理アドレスと認証情報を入力します。
- **セルフホスト型サイト（New API / DoneHub / Veloera / Octopus / AxonHub / Claude Code Hub）**：`設定 -> 基本設定 -> セルフホスト型サイト管理` でバックエンド設定を完了します。

### 4.2 エクスポートプロセス

1. **キー管理に移動**：拡張機能の **キー管理** ページで、エクスポートしたいサイトに対応する API キーを見つけます。
2. **対応する操作をクリック**：キー操作メニューで、「**CherryStudio にエクスポート**」、「**CC Switch にエクスポート**」、「**Kilo Code JSON にエクスポート**」、「**CLIProxyAPI にインポート**」、「**Claude Code Router にインポート**」、または「**現在のセルフホスト型サイトにインポート**」を選択します。
3. **自動処理**：
   * **CherryStudio / CC Switch の場合**：拡張機能は、ターゲットアプリケーションの Deeplink プロトコルに従って、サイト情報と API キーを自動的に渡します。
   * **Kilo Code / Roo Code の場合**：拡張機能は、コピーまたはダウンロード可能な設定 JSON を生成し、手動インポートを容易にします。
   * **CLIProxyAPI / Claude Code Router / セルフホスト型サイトの場合**：拡張機能は、対応する管理インターフェースを呼び出して、Provider / Channel を作成または更新します。

これらの統合機能により、同じアップストリームサイトを複数のダウンストリームツールまたはバックエンドシステムに同期でき、手動での繰り返し貼り付けが不要になります。

## 5. 主要機能の詳細ガイド

### 📊 資産ダッシュボードと統計
- **5.1 [資産概要とリアルタイム更新](./auto-refresh.md)**：複数サイトの残高、使用量、健全状態を一元管理。自動同期をサポート。
- **5.2 [残高履歴](./balance-history.md)**：日々の残高、収入、支出を記録し、資産の変動トレンドを直感的に把握。
- **5.3 [使用量統計分析](./usage-analytics.md)**：トークン消費、モデル分布、コスト、応答遅延を多角的に分析。
- **5.4 [アカウントの管理と維持](./account-management.md)**：効率的な追加、整理（タグ/固定）、重複クリーンアップ。

### 🔑 キー管理とクイック連携
- **5.5 [キー管理 (Tokens)](./key-management.md)**：トークンを一元管理。管理画面で非表示のキーをワンクリックで復元可能。
- **5.6 [API 資格情報プロファイル](./api-credential-profiles.md)**：アカウントを作成せずに URL+Key を独立して保存、一括検証。
- **5.7 [クイックエクスポート](./quick-export.md)**：CherryStudio、CC Switch、Kilo Code 等の [外部ツール](./supported-export-tools.md) への高速同期。
- **5.8 [ウェブ API スニッフィング](./web-ai-api-check.md)**：閲覧中のページから API 設定を識別・テストし、そのまま保存可能。

### ⚡ 自動化と特典獲得
- **5.9 [自動チェックイン](./auto-checkin.md)**：サインイン対応サイトを一括処理。定期実行やカスタム URL 遷移をサポート。
- **5.10 [引き換えアシスタント](./redemption-assist.md)**：ページ上の引き換えコードを自動認識し、ワンクリックで適用。
- **5.11 [ブックマーク管理](./bookmark-management.md)**：AI 関連のコンソール、ドキュメント、チャージページを一元管理。

### 🛡️ 安定性とセキュリティ
- **5.12 [Cloudflare ルール通過アシスタント](./cloudflare-helper.md)**：5秒ルール等のチャレンジを自動支援。API 呼び出しの中断を防止。
- **5.13 [New API 安全検証 (2FA / OTP)](./new-api-security-verification.md)**：管理バックエンドの OTP や Passkey 等の認証チャレンジに対応。
- **5.14 [WebDAV バックアップと同期](./webdav-sync.md)**：データのクロスデバイス暗号化バックアップをサポートし、設定を保護。

### 🛠️ 管理者向け効率化ツール
- **5.15 [セルフホスト型サイト管理](./self-hosted-site-management.md)**：拡張機能内から直接 New API、AxonHub 等のチャネルを管理（増減・編集）。
- **5.16 [モデル同期](./managed-site-model-sync.md) と [リダイレクト](./model-redirect.md)**：アップストリームからのモデル取得と正規化マッピング設定。

### 🎨 カスタマイズと高度な設定
- **5.17 [ソート優先度設定](./sorting-priority.md)**：残高、健全度、サインインの必要性等に基づき、アカウントの表示順を調整。
- **5.18 [シェアスナップショット](./share-snapshot.md)**：機密情報を隠した精美なステータス画像を生成。動的背景で SNS 共有に最適。
- **5.19 [LDOH サイト検索](./ldoh-site-lookup.md)**：Linux.do コミュニティのデータに基づき、サイトの評判やレビューを自動表示。
- **5.20 [開発者ツール](./developer-tools.md)**：視覚的なデバッグと背景のカスタマイズ（Mesh Gradient Lab）。

## 6. インストールとデータ管理

- [Safari インストールガイド](./safari-install.md)
- [QQ / 360 などブラウザのインストールガイド](./other-browser-install.md)
- [権限管理（オプション権限）](./permissions.md)
- [データ管理](./data-management.md)
- [サポートされているサイトとシステムタイプ](./supported-sites.md)

## 7. よくある質問とサポート

- より詳細な [よくある質問](./faq.md) を参照して、認証方法、AnyRouter の適合性、機能使用のヒントなどを確認してください。
- 問題が発生した場合や新機能が必要な場合は、[GitHub Issues](https://github.com/qixing-jk/all-api-hub/issues) でフィードバックをお寄せください。
- 過去の更新については、 [更新ログ](./changelog.md) を参照してください。

::: tip 次のステップ
基本設定が完了したら、自動リフレッシュ、チェックイン検出、または WebDAV 同期を設定して、より完全な使用体験を得ることができます。
:::