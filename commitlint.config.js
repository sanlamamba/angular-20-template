module.exports = {
  extends: ['@commitlint/config-conventional'],
  // ignore merge commits, WIP, and common bot commits
  ignores: [
    (commit) => commit.startsWith('Merge'),
    (commit) => /(^| )WIP($|:|\b)/i.test(commit),
    (commit) => /^dependabot\[bot\]:?/.test(commit),
  ],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting, missing semi colons, etc.
        'refactor', // Code restructuring
        'perf', // Performance improvement
        'test', // Adding tests
        'build', // Build system changes
        'ci', // CI configuration changes
        'chore', // Other changes
        'revert', // Revert previous commit
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // scope: allow empty by default; change to "never" to require scopes
    'scope-empty': [2, 'always'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
