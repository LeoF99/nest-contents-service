const boundariesRules = {
  'boundaries/element-types': [
    2,
    {
      default: 'disallow',
      rules: [
        {
          from: 'controllers',
          allow: ['controllers', 'domains', 'dtos', 'services'],
        },
        {
          from: 'dtos',
          allow: ['dtos', 'domains'],
        },
        {
          from: 'services',
          allow: ['services', 'domains', 'adapters'],
        },
        {
          from: 'domains',
          allow: ['domains'],
        },
        {
          from: 'adapters',
          allow: ['adapters', 'domains', 'entities'],
        },
      ],
    },
  ],
};

const boundariesSettings = {
  'boundaries/elements': [
    {
      type: 'controllers',
      mode: 'file',
      pattern: 'modules/**/controllers/**/*.controller.*',
    },
    {
      type: 'dtos',
      mode: 'file',
      pattern: 'modules/**/controllers/dto/**',
    },
    {
      type: 'services',
      mode: 'file',
      pattern: 'modules/**/domain/**/*.service.*',
    },
    {
      type: 'domains',
      mode: 'file',
      pattern: 'modules/**/domain/**/*(?!.service).*',
    },
    {
      type: 'adapters',
      mode: 'file',
      pattern: 'modules/**/adapters/**',
    },
  ],
};

module.exports = {
  boundariesRules,
  boundariesSettings,
};
