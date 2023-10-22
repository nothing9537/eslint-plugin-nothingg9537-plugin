/**
 * @fileoverview Rule, which checks imports in app. For ex., you cannot use Pages in Shared
 * @author nothingg9537
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;


const aliasOptions = [{
  alias: '@'
}];


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  }
});
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: 'D:\\projects\\production-react-advanced-project\\src\\features\\ArticleComment\\ui\\ArticleComment.tsx',
      code: "import { Button, ButtonTheme } from '@/shared/Button;'",
      options: aliasOptions,
      errors: [],
    },
    {
      filename: 'D:\\projects\\production-react-advanced-project\\src\\features\\ArticleComment\\types\\index.ts',
      code: "import { User, UserRole } from '@/entities/User;'",
      options: aliasOptions,
      errors: [],
    },
    {
      filename: 'D:\\projects\\production-react-advanced-project\\src\\app\\providers\\routerConfig\\routerConfig.tsx',
      code: "import { AppRouteProps } from '@/shared/types/router.ts;'",
      options: aliasOptions,
      errors: [],
    },
    {
      filename: 'D:\\projects\\production-react-advanced-project\\src\\shared\\config\\storybook\\WithStoreDecorator\\WithStoreDecorator.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ],
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'D:\\projects\\production-react-advanced-project\\src\\features\\ArticleComment\\ui\\ArticleComment.tsx',
      code: "import { Aside } from '@/widgets/Aside;'",
      options: aliasOptions,
      errors: [{
        messageId: 'badLayerImport'
      }],
    },
    {
      filename: 'D:\\projects\\production-react-advanced-project\\src\\shared\\ArticleComment\\types\\index.ts',
      code: "import { User, UserRole } from '@/entities/User;'",
      options: aliasOptions,
      errors: [{
        messageId: 'badLayerImport'
      }],
    },
    {
      filename: 'D:\\projects\\production-react-advanced-project\\src\\features\\ArticleComment\\ui\\ArticleComment.tsx',
      code: "import { ProfilePage } from '@/pages/ProfilePage;'",
      options: aliasOptions,
      errors: [{
        messageId: 'badLayerImport'
      }],
    },
  ],
});
