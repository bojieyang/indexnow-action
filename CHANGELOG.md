# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0] - 2024-01-22

### Changed

- Upgrade Nodejs version to v20.
- Use native fetch API instead of cross-fetch. 

### Fixed

-  Fixed the issue that cannot parse sitemapindex with only one sitemap #136 by @TheJiahao.

### Security

- Added instructions for dynamic deploy IndexNow key file to prevent them from being leaked in public repositories. #71 by @Young-Lord. 

## [1.1.2] - 2023-06-25

### Security

- Upgrade fast-xml-parser to 4.2.5 to fix regex vulnerability security issue.

## [1.1.1] - 2023-06-07

### Security

- Upgrade fast-xml-parser to 4.2.4 to fix entity parsing security issue.

## [1.1.0] - 2023-03-31

### Added

- Support RSS 2.0 and Atom 1.0 as sitemap.

## [1.0.0] - 2023-03-12

### Added

- Suport XML sitemap and sitemap Index.