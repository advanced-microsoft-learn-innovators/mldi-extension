# MLDI-EXTENSION

MLDI のブラウザー側拡張機能です。
MSLearn のテキストを読み取り、バックエンドサーバーを通して ChatGPT で処理したのち、ブラウザー側のコンテンツに反映する役割を持つ予定です。

## 開発まで

VSCode で DevContainer を開きます。
ターミナルから次のコマンドで、開発サーバーを実行します：

```bash
pnpm dev
# or
npm run dev
```

`F5` を押して Edge を開き、拡張機能 (`build/chrome-mv3-dev`) を読み込みます。
拡張機能を読み込む手順は、次のドキュメントに従ってください。  
[Sideload an extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)

コンテンツを編集すると、自動で反映されます。
