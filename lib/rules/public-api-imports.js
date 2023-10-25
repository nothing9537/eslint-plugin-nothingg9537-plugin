/**
 * @fileoverview Rule checks, if the import from module is ONLY from public API, by FSD concept.
 * @author nothingg9537
 */
"use strict";

const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

const PUBLIC_API_ERROR = 'badImport';
const PUBLIC_API_TESTING_ERROR = 'badImportTesting';

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
    fixable: 'code', // Or `code` or `whitespace`
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
      [PUBLIC_API_ERROR]: 'Bad import! You can use imports only from public API of module (index.ts)!',
      [PUBLIC_API_TESTING_ERROR]: 'Bad import from testing API! Don\'t import files from testing public API to production files!'
    }
  },

  create(context) {
    const { alias = {}, testFilesPatterns = [] } = context.options[0] ?? {};

    return {
      ImportDeclaration(node) {
        try {
          const value = node.source.value;
          const importTo = alias ? value.replace(`${alias}/`, '') : value;

          if (isPathRelative(importTo)) {
            return;
          }

          const segments = importTo.split('/');

          const layer = segments[0];
          const slice = segments[1];

          if (!ruleCheckingLayers[layer]) {
            return;
          }

          // [entities, Article, testing]
          const isImportNotFromPublicAPI = segments.length > 2;
          const isTestingAPI = segments[2] === 'testing' && segments.length < 4;

          if (isImportNotFromPublicAPI && !isTestingAPI) {
            context.report({
              node,
              messageId: PUBLIC_API_ERROR,
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
              }
            })
          }

          if (isTestingAPI) {
            const currentFilePath = context.filename;

            const isCurrentFileTesting = testFilesPatterns.some(p => micromatch.isMatch(currentFilePath, p));

            if (!isCurrentFileTesting) {
              context.report({
                node,
                messageId: PUBLIC_API_TESTING_ERROR,
              })
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
    };
  },
};
