import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const configs = {

    C01: {

        user: process.env.DB_C01_USER,
        password: process.env.DB_C01_PASSWORD,
        server: process.env.DB_C01_SERVER,
        database: process.env.DB_C01_DATABASE,

        options:{
            encrypt:true,
            trustServerCertificate:true
        },

        pool:{
            max:10,
            min:0,
            idleTimeoutMillis:30000
        }

    },

    C02:{

        user:process.env.DB_C02_USER,
        password:process.env.DB_C02_PASSWORD,
        server:process.env.DB_C02_SERVER,
        database:process.env.DB_C02_DATABASE,

        options:{
            encrypt:true,
            trustServerCertificate:true
        },

        pool:{
            max:10,
            min:0,
            idleTimeoutMillis:30000
        }

    }

};

const pools={};

export async function getPool(sede){

    if(!pools[sede]){

        pools[sede]=await new sql.ConnectionPool(configs[sede]).connect();

        console.log(`Conectado a ${sede}`);

    }

    return pools[sede];

}

export {sql};