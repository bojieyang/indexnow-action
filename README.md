<h1 align="center">indexnow-action</h1>
<p align="center">
<img alt="GitHub Workflow Status (with branch)" src="https://img.shields.io/github/actions/workflow/status/bojieyang/indexnow-action/test.yml?branch=main">
  <img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/bojieyang/indexnow-action">
<img alt="GitHub" src="https://img.shields.io/github/license/bojieyang/indexnow-action">
</p>
<p align="center">
A GitHub Action that automatically submits URLs to participating search engines through the IndexNow protocol.
</p>
<!--
<p align="center">
  <a href="README.zh.md">中文版本</a>
</p>
 -->

## Usage

### **Prerequisites**

The key file has been obtained from IndexNow and added to your website.

If you don't know how to get the key file, see [IndexNow Document](https://www.indexnow.org/documentation).

### **Basic**

```yaml
steps:
  - uses: bojieyang/indexnow-action@v1 # v1 is the latest major version following the action-versioning.
    with:
      sitemap-location: "https://example.com/sitemap.xml" # your sitemap location, must start with http(s).
      key: ${{ secrets.INDEXNOW_KEY }} # The key you get from IndexNow.
```

### **Examples**

A complete example used in my blog shows below:

```yaml
name: "IndexNow"
on:
  schedule:
    # Set the schedule time
    - cron: "0 2 * * *"

jobs:
  check-and-submit:
    runs-on: ubuntu-latest
    steps:
      - name: indexnow-action
        uses: bojieyang/indexnow-action@v1
        with:
          sitemap-location: "https://bojieyang.github.io/sitemap.xml"
          key: ${{ secrets.INDEXNOW_KEY }}
```

View code from [here](https://github.com/bojieyang/bojieyang.github.io/blob/master/.github/workflows/IndexNow.yml).

### **Inputs**

- sitemap-location
  `required`.
  The location of sitemap file in your website. Must start with https or http(e.g., https://example.com/sitemap.xml).

- key
  `required`.
  The IndexNow key that you get from search engines.

  > **Note** DO NOT stored as plaintext in the workflow file. Use GitHub Secrets instead.
  > More about GitHub Secrets, see [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

- key-location
  `optional`.
  Location of the IndexNow key file that you customed.
  If not set, it will assume that there is a file named `{your-indexnow-key}.txt` in the root directory of the website(e.g., https://example.com/{your-indexnow-key}.txt).

  > **Note** DO NOT stored as plaintext in the workflow file. Use GitHub Secrets instead.
  > More about GitHub Secrets, see [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

- since
  `optional`.
  URLs with `lastmod` fields in sitemap files within the last {since} {since-unit} will be submitted. The default value is 1.

- since-unit
  `optional`.
  The unit of since. Available units are `minute`, `hour`, `day`, `week`, `month` and `year`. The default value is `day`.

- endpoint
  `optional`.

  The endpoint of a special search engine. Available units are `api.indexnow.org`, `www.bing.com`, `search.seznam.cz` and `yandex.com`. For more details, see: [IndexNow FAQ](https://www.indexnow.org/faq). The default value is www.bing.com.

- limit
  `optional`.
  The upper limit for submitting URLs. The default value is 100.

- timeout
  `optional`.
  The timeout both fetch sitemap and submit to the search engine in milliseconds. The default value is 10000 (10 seconds).

- failure-strategy
  `optional`
  Define the strategy when submit failed. Available strategy are `ignore` and `error`.
  For `ignore`, will outputting an notice only.
  For `error`, outputting an error message also sets the status of action to fail. The Default value is `ignore`.

## Maintainers

[@bojieyang](https://github.com/bojieyang)

## Acknowledgements

Use [@seantomburke/sitemapper](https://github.com/seantomburke/sitemapper) to fetch and parse sitemap.

Use [@iamkun/dayjs](https://github.com/iamkun/dayjs) to simplify date-related calculations.

## Contributing

Contributions are welcome! Please create an issue and if applicable, a design before proceeding with code.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
