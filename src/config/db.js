import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const c01Config = {
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
    server: process.env.DB_LOCAL_SERVER,
    database: process.env.DB_LOCAL_DATABASE, 
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolPromise = new sql.ConnectionPool(c01Config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error crítico al conectar a SQL Server:', err);
        process.exit(1);
    });

export { sql, poolPromise };