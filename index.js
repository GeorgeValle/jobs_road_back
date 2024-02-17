//Dotenv config
import dotenv from 'dotenv';
dotenv.config();

//Config server Express
import express from 'express';



//import of passport
import passport from 'passport';
import cookieParser from "cookie-parser";

import sessionRouter from "./src/routes/SessionRouter.js";

import initializatePassport from "./src/config/PassportConfig.js"

// ../config/PassportConfig.js"; 

//import routes




const PORT = parseInt(process.argv[2]) || process.env.PORT ||8080
const modoCluster = process.argv[3] == 'CLUSTER'


//configure express
const app= express ();

if (modoCluster && cluster.isPrimary) {
    const numCPUs = cpus().length

    console.log(`Número de procesadores: ${numCPUs}`)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
} else {


    const server = app.listen(PORT,()=>{
        console.log(`listening on ${PORT}`)
        console.log(`PID WORKER ${process.pid}`)
    });
    
    server.on('error', error => console.log(`error in server: ${error} `));
    
    //middleware of json
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser("keyCookieJobsRoad"));
    initializatePassport();
    app.use(passport.initialize());
    app.use(passport.session());
    

    //routes
    app.use("/api/session", sessionRouter);
    //app.use('/teams',teamRouter);


    //message for inexistent routes
    app.use((req, res) => {
        res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
    });

    app.use((error, req , res, next)=>{
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    })

}