## node-mysql-query-with-cache ##
[mysql-query][1] wrapper for automatic results caching
## Installing ##
Add to you package.json file:

    "dependencies": {
       "mysql-query-with-cache": "git://github.com/ria-com/node-mysql-query-with-cache.git"
    }
Then run `npm install`...
## Usage example ##
Add to your `default.js` config file:

    memcached: {
        host: '127.0.0.1',
        port: '11211',
        options: {
            poolSize: 32
        }
    },
    database: {
        'master': {
            host: 'localhost',
            user: 'username',
            password: 'password',
            port: '3306',
            database: 'database',
            connectionLimit: 10
        },
        'slave': {
            host: 'localhost',
            user: 'username',
            password: 'password',
            port: '3306',
            database: 'database',
            connectionLimit: 10
        }
    }
Then include and use:

    var query = require('mysql-query-with-cache'),
        qs = 'SELECT * FROM foo WHERE bar=?',
        cacheTime = 3600;
        
    query(qs, ['baz'], 'master', cacheTime, function(err, rows, fields){
        /* Do what you need here */
    });
    
  [1]: https://github.com/ria-com/node-mysql-query