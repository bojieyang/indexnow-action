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

## 支持的格式

- [x] XML Sitemap
- [x] Sitemap Index
- [x] RSS 2.0
- [x] Atom 1.0
## 使用说明

### **前提条件**

已经从 IndexNow 获取了 Key 文件并添加到了你的网站上。
如果你不知道如何获取 Key 文件，请看[IndexNow 文档](https://www.indexnow.org/documentation)。

### **基本使用**

```yaml
steps:
  - uses: bojieyang/indexnow-action@v1 # v1 is the latest major version following the action-versioning.
    with:
      sitemap-location: 'https://example.com/sitemap.xml' # your sitemap location, must start with http(s).
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
        uses: bojieyang/indexnow-action@v1
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

## 维护者

[@bojieyang](https://github.com/bojieyang)

## 致谢

使用 [@seantomburke/sitemapper](https://github.com/seantomburke/sitemapper) 获取和解析 sitemap.

使用 [@iamkun/dayjs](https://github.com/iamkun/dayjs) 简化日期相关的计算。

## 贡献代码

欢迎贡献代码。请在编写代码之前创建一个`issue`来说明相关意图。如果有必要，请附上设计方案。

## 许可证

本项目使用 [MIT License](LICENSE) 许可发行。
