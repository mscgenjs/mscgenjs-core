module.exports = {
  extends: 'dependency-cruiser/configs/recommended-strict',
  forbidden: [
    {
      name: 'not-between-renderers',
      comment: "Don't allow dependencies between the different types of renderers",
      severity: 'error',
      from: {
        path: '^src/render/graphics|^src/render/astmassage'
      },
      to: {
        path: '^src/render/text/'
      }
    },
    {
      name: 'not-to-test',
      comment: "Don't allow dependencies from outside the test folder to test",
      severity: 'error',
      from: {
        pathNot: '^test'
      },
      to: {
        path: '^test'
      }
    },
    {
      name: 'not-from-test-to-dist',
      comment: "Don't allow dependencies from test to dist (we're testing src only)",
      severity: 'error',
      from: {
        path: '^test',
        pathNot: '^test/dist-index\\.spec\\.js'
      },
      to: {
        path: 'dist'
      }
    },
    {
      name: 'not-to-spec',
      comment: "Don't allow dependencies to (typescript/ javascript) spec files",
      severity: 'error',
      from: {},
      to: {
        path: '\\.spec\\.[js|ts]$'
      }
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment: "Don't allow dependencies from src/app/lib to a development only package",
      from: {
        path: '^src'
      },
      to: {
        dependencyTypes: ['npm-dev']
      }
    },
    {
      name: 'optional-deps-used',
      severity: 'error',
      comment: "We're not working with optional dependencies - don't make sense for mscgenjs",
      from: {},
      to: {
        dependencyTypes: ['npm-optional']
      }
    },
    {
      name: 'peer-deps-used',
      comment: "At this moment peer dependencies don't make sense for mscgenjs",
      severity: 'error',
      from: {},
      to: {
        dependencyTypes: ['npm-peer']
      }
    },
    {
      name: 'no-unreachable-from-api',
      comment: 'All sources should be reachable from the API entry point',
      from: {
        path: '^src/index\\.ts$|^src/index-lazy\\.ts$'
      },
      to: {
        path: '^src/',
        pathNot: '\\.d\\.ts$|/mscgenjs-ast\\.schema\\.json$',
        reachable: false
      }
    },
    {
      name: 'no-uncovered',
      comment: 'All sources should be reachable from at least one test',
      severity: 'error',
      from: {
        path: '^test/^[\\.]+/\\.spec\\.ts$'
      },
      to: {
        path: '^src/',
        reachable: false
      }
    }
  ],
  options: {
    moduleSystems: ['cjs', 'es6'],
    // doNotFollow is already implied in the 'recommended-strict' config
    // "doNotFollow": "node_modules",
    tsPreCompilationDeps: true,
    prefix: 'https://github.com/mscgenjs/mscgenjs-core/blob/develop/'
  }
};
