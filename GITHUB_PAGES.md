# GitHub Pages で公開する

このプロジェクトは `main` ブランチへ push すると、自動でビルドして GitHub Pages へ公開されます。

1. GitHubで空のリポジトリを作成します。
2. このフォルダをGitリポジトリとして登録し、`main` ブランチへpushします。
3. GitHubのリポジトリで **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
4. **Actions** タブの `Deploy to GitHub Pages` が完了するのを待ちます。

公開URLは通常 `https://ユーザー名.github.io/リポジトリ名/` です。

## 初回pushの例

```powershell
git init
git add .
git commit -m "Publish game on GitHub Pages"
git branch -M main
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
```

以降は変更をcommitして `git push` すれば、自動でサイトが更新されます。
