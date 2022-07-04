import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import veterinaryRoutes from './routes/veterinaryRoutes.js';
import patientRoutes from './routes/patientRoutes.js'

const app = express();

app.use(express.json());

dotenv.config();
connectDB();

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function( origin, callback ) {
        
        if( allowedDomains.indexOf(origin) !== -1 ) {
            // The origin of the request is allowed
            callback(null, true);

        } else {
            callback( new Error('No permitido por CORS') );
        }
    }
};

console.log(process.env.MONGO_URI);

app.use(cors( corsOptions ));

app.use('/api/veterinarios', veterinaryRoutes);
app.use('/api/pacientes', patientRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});