const $package = require('../package.json');

process.stdout.write(
    JSON.stringify(
        {
            version: $package.version
        },
        null,
        2
    )
);