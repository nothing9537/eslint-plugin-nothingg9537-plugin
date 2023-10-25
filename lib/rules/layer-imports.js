/**
 * @fileoverview Rule, which checks imports in app. For ex., you cannot use Pages in Shared
 * @author nothingg9537
 */
"use strict";

const path = require('path');
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

const ruleLayers = {
  app: ['pages', 'widgets', 'features', 'entities', 'shared'],
  pages: ['widgets', 'features', 'entities', 'shared'],
  widgets: ['features', 'entities', 'shared'],
  features: ['entities', 'shared'],
  entities: ['entities', 'shared'],
  shared: ['shared'],
}

const availableLayers = {
  'app': 'app',
  'entities': 'entities',
  'features': 'features',
  'widgets': 'widgets',
  'pages': 'pages',
  'shared': 'shared',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Rule, which checks imports in app. For ex., you cannot use Pages in Shared",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string',
        },
        ignoreImportPatterns: {
          type: 'array',
        }
      }
    }], // Add a schema if the rule has options,
    messages: {
      'badLayerImport': 'A layer can only import underlying layers into itself! (shared, entities, features, widgets, pages, app)',
    }
  },

  create(context) {
    const { alias = {}, ignoreImportPatterns = [] } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.filename;

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split('src')[1];
      const segments = projectPath?.split('\\')

      return segments?.[1];
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/')

      return segments?.[0]
    }

    return {
      ImportDeclaration(node) {
        try {
          const importPath = node.source.value
          const currentFileLayer = getCurrentFileLayer()
          const importLayer = getImportLayer(importPath)

          if (isPathRelative(importPath)) {
            return;
          }

          if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
            return;
          }

          const isIgnored = ignoreImportPatterns.some(pattern => {
            return micromatch.isMatch(importPath, pattern)
          });

          if (isIgnored) {
            return;
          }

          if (!ruleLayers[currentFileLayer]?.includes(importLayer)) {
            context.report({
              node,
              messageId: 'badLayerImport'
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    };
  },
};