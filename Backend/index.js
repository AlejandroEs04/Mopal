import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import TypeRoutes from './routes/TypeRoutes.js';
import ClassificationRoutes from './routes/ClassificationRoute.js';
import ProductRoutes from './routes/ProductRoutes.js';
import ProductListRoutes from './routes/ProductListRoutes.js'
import UserRoutes from './routes/UserRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import SpecifRotes from './routes/SpecificationRoutes.js';
import SupplierRoutes from './routes/SupplierRoutes.js';
import CustomerRoutes from './routes/CustomerRoutes.js';
import PurchaseRoutes from './routes/PurchaseRoutes.js';
import SalesRoutes from './routes/SaleRouter.js';
import RolRoutes from './routes/RolRoutes.js';
import RequestRoutes from './routes/RequestRoutes.js';
import ContactRoutes from './routes/ContactRoutes.js';
import ReportRoutes from './routes/ReportRoutes.js'
import SendEmail from './routes/SendEmailRoutes.js'
import DiscountsRoutes from './routes/DiscountRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

const whiteList = [
    process.env.FRONTEND_URL, 
    process.env.FRONTEND_URL_2
];

const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.includes(origin)) {
            // Esta permitido consultar la API
            callback(null, true);
        } else {
            // No esta permitido a consultar la API
            console.log(origin)
            callback(new Error('Error de cors'));
        }
    }
}

app.use(cors(corsOptions));

/** ROUTING */
app.use('/api/types', TypeRoutes);
app.use('/api/classifications', ClassificationRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/productsList', ProductListRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/specifications', SpecifRotes);
app.use('/api/suppliers', SupplierRoutes);
app.use('/api/customers', CustomerRoutes);
app.use('/api/purchases', PurchaseRoutes);
app.use('/api/sales', SalesRoutes);
app.use('/api/roles', RolRoutes);
app.use('/api/request', RequestRoutes);
app.use('/api/contact', ContactRoutes);
app.use('/api/report', ReportRoutes);
app.use('/api/sendEmail', SendEmail);
app.use('/api/discounts', DiscountsRoutes);

const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
})