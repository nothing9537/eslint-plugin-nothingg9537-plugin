/**
 * @fileoverview Rule checks, if the import from module is ONLY from public API, by FSD concept.
 * @author nothingg9537
 */
"use strict";

const { isPathRelative } = require('../helpers');

const ruleCheckingLayers = {
  'entities': 'entities',
  'features': 'features',
  'widgets': 'widgets',
  'pages': 'pages',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Rule checks, if the import from module is ONLY from public API, by FSD concept.",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string'
        }
      }
    }],
    messages: {
      badImport: 'Bad import! You can use imports only from public API of module (index.ts)!'
    }
  },

  create(context) {
    const alias = context.options?.[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split('/');

        const layer = segments[0];

        if (!ruleCheckingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicAPI = segments.length > 2;

        if (isImportNotFromPublicAPI) {
          context.report({
            node,
            messageId: 'badImport',
          })
        }
      }
    };
  },
};
