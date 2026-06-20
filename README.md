# Personality Checker

5つの質問に答えるだけで、あなたの性格傾向をかんたんにチェックできるシンプルな診断ツールです。

## ファイル構成

```text
personality-checker/
├── index.html
├── style.css
├── script.js
├── json/
│   ├── questions.json
│   └── warning.json
└── README.md
```

## 使い方

ローカルサーバー経由で `index.html` を開いてください。

`json` を `fetch()` で読み込むため、HTMLファイルを直接ダブルクリックするとブラウザによってはデータ読み込みに失敗します。

## URL

https://doraiso.github.io/personality-checker/

## プライバシーについて

このツールは、入力された内容をサーバーに送信したり、保存したりしません。  
すべての処理はブラウザ上で完結します。
