# Task - Atlan Frontend Engineer

This is a dummy application made for interview.

## Overview

This application allows you to write SQL querie and run them.
The queries are in `sync` with data from predefined arrays.
Only supports `SELECT` queries, which are limited to take specified columns, and order ascending / descending by one of them.

## Framework and Libraries

- [vue v3.3.4](https://www.npmjs.com/package/vue/v/3.3.4) - Reactive JavaScript Framework
  - [vue-virtual-scroller v2.0.0-beta.8](https://www.npmjs.com/package/vue-virtual-scroller/v/2.0.0-beta.8) - Best implementation of virtual scroll concept
  - [@guolao/vue-monaco-editor ^1.1.3](https://www.npmjs.com/package/@guolao/vue-monaco-editor/v/1.1.3) - Vue component for easy using of monaco editor
- [@faker-js/faker v8.0.2](https://www.npmjs.com/package/@faker-js/faker/v/8.0.2) - Fake data to seed the databases
- [node-sql-parser v4.8.0](https://www.npmjs.com/package/node-sql-parser/v/4.8.0) - Parse SQL and returns Abstract Syntax Tree

## Performance and Optimization

I have tested my page load time with [Pingdom](https://tools.pingdom.com/#626a2a13f6400000) and you can see results checking the link.
Unfortunately I had no time to measure [re-rendering performance](https://vuejs.org/guide/best-practices/performance.html#props-stability), but I found great info about that from official documentation.
I prevent crushing of browser, even my database tables have 100k records, because I used Virtual Scroller.

## Project Setup

```sh

pnpm install

```

### Compile and Hot-Reload for Development

```sh

pnpm run dev

```
