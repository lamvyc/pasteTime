#!/bin/bash
# 一键启动 PasteTime 开发环境
 
cd renderer && npm start &
cd pasteTime-app && npm start 

# 备份、删除子仓库
rm -rf pasteTime-app/.git
rm -rf renderer/.git

# 如果误添加过子模块，顺便删掉 .gitmodules
rm -f .gitmodules

# 把两处 .gitignore 的内容合并进根目录（可选）
cat pasteTime-app/.gitignore renderer/.gitignore >> .gitignore

# 重新提交
git add .
git commit -m "chore: 移除子仓库，仅保留根仓库"
git push 