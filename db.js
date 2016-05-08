var Client = require('mariasql');
var c = new Client({ host: '127.0.0.1', user: 'root', password: 'root' });
c.query('SHOW DATABASES', function(err, rows) { if (err) throw err; console.dir(rows); });
c.query('USE paint;', function(err, rows) { if (err) throw err; console.dir(rows); })
c.query('INSERT INTO sessions VALUES (null, \'123abc\', now());', function(err, rows) { if (err) throw err; console.dir(rows); })
c.query('SELECT * FROM sessions;', function(err, rows) { if (err) throw err; console.dir(rows); })
c.end();