/**
 * @fileoverview Path checker for production-react-advanced-project. FSD frontend architecture
 * @author nothingg9537
 */
"use strict";

const path = require('path');
const { isPathRelative } = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Path checker for production-react-advanced-project",
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
      badPath: 'Bad path in local module! Please use local imports imports instead of absolute imports in module!',
    }
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        const currentFileName = context.filename;

        if (shouldBeRelative(currentFileName, importTo)) {
          context.report({
            node,
            messageId: 'badPath'
          });
        }
      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'widgets': 'widgets',
  'pages': 'pages',
};

function shouldBeRelative(from = '', to = '') {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split('/');
  const toLayer = toArray[0]; //entities
  const toSlice = toArray[1]; //Article

  if (!layers[toLayer] || !toLayer || !toSlice) {
    return false;
  }

  const normalizedFromPath = path.toNamespacedPath(from);
  const projectFrom = normalizedFromPath.split('src\\')[1];
  const fromArray = projectFrom.split('\\');

  const fromLayer = fromArray[0];
  const fromSlice = fromArray[1];

  if (!layers[fromLayer] || !fromLayer || !fromSlice) {
    return false;
  }

  return fromSlice === toSlice && fromLayer === toLayer;
}
