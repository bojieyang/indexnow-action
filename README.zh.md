<h1 align="center">IndexNow Action</h1>
<p align="center">
<a href="https://github.com/bojieyang/indexnow-action/actions/workflows/basic-validation.yml">
  <img alt="Basic validation" src="https://github.com/bojieyang/indexnow-action/actions/workflows/basic-validation.yml/badge.svg">
</a>
<img alt="GitHub Workflow Status (with branch)" src="https://img.shields.io/github/actions/workflow/status/bojieyang/indexnow-action/test.yml?branch=main">
  <img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/bojieyang/indexnow-action">
<img alt="GitHub" src="https://img.shields.io/github/license/bojieyang/indexnow-action">
</p>
<p align="center">
根据你设定的规则，通过 IndexNow 协议自动提交 URLs 的工具。
</p>

<p align="center">
  <a href="README.md">English version</a>
</p>

## 使用说明

### **前提条件**

已经从 IndexNow 获取了 Key 文件并添加到了你的网站上。
如果你不知道如何获取 Key 文件，请看[IndexNow 文档](https://www.indexnow.org/documentation)。

> [!TIP]
> 如果你的网站是存放在公开仓库 (例如 GitHub Pages)，将 Key 文件直接保存在仓库中会泄露此文件的内容和位置，可能存在潜在的安全风险。如果你想避免这种情况，请使用在部署时生成 key 文件的方案。请参考`在部署时生成 IndexNow Key 文件`一节。

### **基本使用**
```yaml
steps:
  - uses: bojieyang/indexnow-action@v2 # v2 is the latest major version following the action-versioning.
    with:
    # The location of your sitemap must start with http(s). 
    # Currently, XML Sitemap, Sitemap index, RSS and Atom formats are supported.
      sitemap-location: 'https://example.com/sitemap.xml' 
      key: ${{ secrets.INDEXNOW_KEY }} # The key you get from IndexNow.
```

### **示例**

下面是在我的博客中使用的实际例子：

```yaml
name: 'IndexNow'
on:
  schedule:
    # Set the schedule time
    - cron: '0 2 * * *'

jobs:
  check-and-submit:
    runs-on: ubuntu-latest
    steps:
      - name: indexnow-action
        uses: bojieyang/indexnow-action@v2
        with:
          sitemap-location: 'https://bojieyang.github.io/sitemap.xml'
          key: ${{ secrets.INDEXNOW_KEY }}
```

浏览代码见[这里](https://github.com/bojieyang/bojieyang.github.io/blob/master/.github/workflows/IndexNow.yml).

### **参数**

- sitemap-location
  `必填`。
  设置网站中 sitemap 文件的路径。必须以 https 或 http 开头（示例：https://example.com/sitemap.xml）。

- key
  `必填`。
  设置你从搜索引擎处获取到的 IndexNow key。

  > **Note** 不要将值以纯文本的方式存储在你的 workflow 文件中，而是使用 GitHub Secrets 来加密存储。
  > 关于 GitHub Secrets 的更多信息，详见[Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)。

- key-location
  `可选`。
  设置自定义的 IndexNow key 文件在网站的路径。
  如果没有设置，则假定文件名为`{your-indexnow-key}.txt`，存放在网站根目录下（示例：https://example.com/{your-indexnow-key}.txt）。

  > **Note** 不要将值以纯文本的方式存储在你的 workflow 文件中，而是使用 GitHub Secrets 来加密存储。
  > 关于 GitHub Secrets 的更多信息，详见[Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)。

- since
  `可选`。
  设置距当前多长时间内的 URLs 会被提交给搜索引擎。sitemap 文件中的 URL，如果其`lastmod`字段为最近 {since} {since-unit} 内，则会被提交。默认值是 1。

- since-unit
  `可选`。
  设置 since 对应的单位。可用的单位为`minute`, `hour`, `day`, `week`, `month` 和 `year`. 默认值是 `day`。

- endpoint
  `可选`。
  设置提交的搜索引擎。可用的值为`api.indexnow.org`, `www.bing.com`, `search.seznam.cz` 和 `yandex.com`。
  更多内容请参考[IndexNow FAQ](https://www.indexnow.org/faq). 默认值是 `www.bing.com`。

- limit
  `可选`。
  设置提交的 URLs 的数量上限。默认值是 100。

- timeout
  `可选`。
  设置获取 sitemap 和提交到搜索引擎的超时时间，单位为毫秒。默认值是 10000（10 秒）。

- failure-strategy
  `可选`。
  设置提交失败时的处理策略。可用的值为`ignore` 和 `error`。
  设置为 `ignore`, 表示仅输出提醒信息。
  设置为 `error`, 表示输出错误信息的同时会将 Action Status 设置为失败。默认值为`ignore`。

## 支持的格式

- [x] XML Sitemap
- [x] Sitemap Index
- [x] RSS 2.0
- [x] Atom 1.0

## 在部署时生成 IndexNow Key 文件
在部署时动态生成 key 文件，可以避免将 key 文件存放在公开仓库中导致泄露的问题。不同的平台有各自的在部署流程中动态生成文件的方案。这里以 GitHub Pages 为例，介绍对应的解决方案。

部署方案具体步骤如下：
1. 通过 GitHub Secrets 存储 IndexNow 的 key 的内容。
2. 通过 GitHub Action 部署网站。
3. 在对应 Action 的部署配置中加入一下内容：
```yaml
 jobs:
   build:
     steps: 
      ### ... 省略其他步骤
      - name: Setup IndexNow 
      # Generate files dynamically to prevent them from being leaked in public repositories.
      # This example will put the file in the root directory of the site.You may change the location by yourself.
        run: echo ${{ secrets.INDEXNOW_KEY }} > ${{ secrets.INDEXNOW_KEY }}.txt
      ### ... 省略其他步骤
```
完整部署文件详见[这里](https://github.com/bojieyang/bojieyang.github.io/blob/master/.github/workflows/jekyll.yml)。

## 版本说明

v2 是当前维护版本，基于 Node.js v20。建议在可能的情况下尽量使用 V2 版本。

v1 版本为遗留版本，基于 Node.js v16。当无法使用 Node.js v20 版本时，可以使用此版本。

## 维护者

[@bojieyang](https://github.com/bojieyang)

## 致谢

使用 [lquixada/cross-fetch](https://github.com/lquixada/cross-fetch) 在 Nodejs v16 版本中兼容 WHATWG Fetch API。

使用 [@NaturalIntelligence/fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) 解析 XML。

使用 [@iamkun/dayjs](https://github.com/iamkun/dayjs) 简化日期相关的计算。

## 贡献代码

欢迎贡献代码。请在编写代码之前创建一个`issue`来说明相关意图。如果有必要，请附上设计方案。

## 许可证

本项目使用 [MIT License](LICENSE) 许可发行。
