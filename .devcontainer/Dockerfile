# 軽量 Ubuntu ベース
FROM ubuntu:22.04

# 非対話モード（aptの途中で質問されないようにする）
ENV DEBIAN_FRONTEND=noninteractive

# 必要最低限のツールとNode.jsをインストール
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    git \
    openssh-client \
    sudo \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Node.js（LTS）をインストール
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 汎用ユーザー
RUN useradd -m -s /bin/bash vscode \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 作業ディレクトリ
WORKDIR /workspace

# ViteとVitestをグローバルインストール
RUN npm install -g vite vitest

# 開発サーバー用ポート
EXPOSE 5173

USER vscode

# デフォルトコマンド
CMD ["bash"]
