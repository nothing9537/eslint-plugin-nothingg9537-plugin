/**
 * @fileoverview Rule checks, if the import from module is ONLY from public API, by FSD concept.
 * @author nothingg9537
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  }
});
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { ArticleList } from 'entities/ArticleList';",
      errors: [],
    },
    {
      code: "import { ArticleList } from '@/entities/ArticleList';",
      errors: [],
      options: [{
        alias: '@'
      }]
    },
  ],

  invalid: [
    {
      code: "import { ArticleList } from 'entities/ArticleList/ui/ArticleList/ArticleList';",
      errors: [
        {
          message: 'Bad import! You can use imports only from public API of module (index.ts)!',
        },
      ],
    },
    {
      code: "import { ArticleList } from '@/entities/ArticleList/ui/ArticleList/ArticleList';",
      errors: [
        {
          message: 'Bad import! You can use imports only from public API of module (index.ts)!',
        },
      ],
      options: [{
        alias: '@'
      }]
    },
  ],
});
