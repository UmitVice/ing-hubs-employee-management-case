/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';
import { rollupAdapter } from '@web/dev-server-rollup';
import alias from '@rollup/plugin-alias';
import path from 'path';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  appIndex: 'index.html',
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  middleware: [
    function aliasAtToSrc(ctx, next) {
      if (ctx.url && ctx.url.startsWith('/@/')) {
        ctx.url = ctx.url.replace('/@/', '/src/');
      }
      return next();
    }
  ],
  preserveSymlinks: true,
  plugins: [
    rollupAdapter(alias({
      entries: [
        { find: '@', replacement: path.resolve('.', 'src') },
      ],
    })),
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
};
