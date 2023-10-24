/**
 * @fileoverview Path checker for production-react-advanced-project
 * @author nothingg9537
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
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
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: 'C:\\Users\\Nothingg9537\\Desktop\\projects\\production-react-advanced-project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice';",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\Nothingg9537\\Desktop\\projects\\production-react-advanced-project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice';",
      errors: [{
        messageId: 'badPath',
      }],
    },
    {
      filename: 'C:\\Users\\Nothingg9537\\Desktop\\projects\\production-react-advanced-project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice';",
      errors: [{
        messageId: 'badPath',
      }],
      options: [{
        alias: '@'
      }]
    },
  ],
});
