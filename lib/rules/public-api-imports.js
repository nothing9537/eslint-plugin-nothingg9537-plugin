/**
 * @fileoverview Rule checks, if the import from module is ONLY from public API, by FSD concept.
 * @author nothingg9537
 */
"use strict";

const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

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
        },
        testFilesPatterns: {
          type: 'array',
        }
      }
    }],
    messages: {
      badImport: 'Bad import! You can use imports only from public API of module (index.ts)!',
      badImportTesting: 'Bad import from testing API! Don\'t import files from testing public API to production files!'
    }
  },

  create(context) {
    const { alias = {}, testFilesPatterns = [] } = context.options[0] ?? {};

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

        // [entities, Article, testing]
        const isImportNotFromPublicAPI = segments.length > 2;
        const isTestingAPI = segments[2] === 'testing' && segments.length < 4;

        if (isImportNotFromPublicAPI && !isTestingAPI) {
          context.report({
            node,
            messageId: 'badImport',
          })
        }

        if (isTestingAPI) {
          const currentFilePath = context.filename;

          const isCurrentFileTesting = testFilesPatterns.some(p => micromatch.isMatch(currentFilePath, p));

          if(!isCurrentFileTesting) {
            context.report({
              node,
              messageId: 'badImportTesting',
            })
          }
        }
      }
    };
  },
};
