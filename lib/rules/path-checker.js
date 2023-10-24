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
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
    messages: {
      badPath: 'Bad path in local module! Please use local imports imports instead of absolute imports in module!',
    }
  },

  create(context) {
    const alias = context.options[0]?.alias || ''

    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importFrom = alias ? value.replace(`${alias}/`, '') : value
        const fromFileName = context.filename;

        if (shouldBeRelative(fromFileName, importFrom)) {
          context.report({
            node: node,
            messageId: 'badPath',
            data: {},
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFileName)
                .split('/')
                .slice(0, -1)
                .join('/');

              let relativePath = path.relative(normalizedPath, `/${importFrom}`);

              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`);
            },
          })
        }
      },
    }
  },
};

const layers = {
  entities: 'entities',
  features: 'features',
  shared: 'shared',
  pages: 'pages',
  widgets: 'widgets',
}

function getNormalizedCurrentFilePath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath).replace(/\\/g, '/');
  const project = normalizedPath.split('src')[1];

  return project;
}

function shouldBeRelative(currentFile, from) {
  if (isPathRelative(from)) {
    return false;
  }

  // from 'entities/Article'
  const fromArray = from.split('/')
  const fromLayer = fromArray[0] // entities
  const fromSlice = fromArray[1] // Article

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  const project = getNormalizedCurrentFilePath(currentFile);
  const projectArray = project.split('/');

  const projectLayer = projectArray[1];
  const projectSlice = projectArray[2];

  if (!projectLayer || !projectSlice || !layers[projectLayer]) {
    return false;
  }

  return projectLayer === fromLayer && projectSlice === fromSlice;
}
