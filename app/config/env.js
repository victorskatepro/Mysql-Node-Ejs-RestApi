const env = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_mysql',
    port: 8889,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = env;