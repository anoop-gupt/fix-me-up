module.exports = {
    parser: 'babel-eslint',
    extends: 'airbnb',
    env: {
        browser: true,
    },
    plugins: ['react', 'jsx-a11y', 'import'],
    rules: {
        'comma-dangle': ['error', 'never'],
        'class-methods-use-this': ['off'],
        'no-return-assign': ['error', 'except-parens'],
        'max-len': ['error', 200, {
          'ignoreComments': true,
          'ignoreUrls': true
        }],
        'no-underscore-dangle': ['error', {
          allow: ['_id']
        }],
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: {
                  array: false,
                  object: true,
                },
                AssignmentExpression: {
                  array: true,
                  object: false,
                },
            },
            {
              enforceForRenamedProperties: false,
            },
        ],
        'import/prefer-default-export': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'react/prop-types': [2, {
          ignore: ['children']
        }],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [
          'error', {
              extensions: ['.js'],
          },
        ],
    },
};
