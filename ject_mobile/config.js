const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'ttjob-project.ctyetg9uawza.ap-southeast-2.rds.amazonaws.com',
  user: 'node_admin1',
  password: '7t-8lopR9903f',
  database: 'project_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;