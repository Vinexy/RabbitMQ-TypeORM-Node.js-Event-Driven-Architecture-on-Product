import * as express from "express";
import * as cors from "cors";
import { Request,Response } from "express";

import { AppDataSource } from "./data-source"
import { Product } from "./entity/product";

import * as amqp from "amqplib/callback_api"


AppDataSource.initialize().then(async () => {
    const productRepository = AppDataSource.getRepository(Product);

    amqp.connect('***********************', (error0, connection)=>{
        if(error0) {
            throw error0
        }
        connection.createChannel((error1, channel)=>{
            if(error1) {
                throw error1
            }

            const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:8080', 'https://localhost:4200']
}))

app.use(express.json());

app.get('/api/products',async(req: Request, res: Response)=>{
    const products = await productRepository.find();

    res.json(products);
})

app.post('/api/products',async(req: Request, res: Response)=>{
    const products = await productRepository.create(req.body);
    const result = await productRepository.save(products);
    channel.sendToQueue('product_created', Buffer.from(JSON.stringify(result)));
    return res.send(result);
});

app.get('/api/products/:id',async(req: Request, res: Response)=>{
    const product = await productRepository.findOneBy({id:parseInt(req.params.id,10)});

    return res.send(product);
})

app.put('/api/products/:id',async(req: Request, res: Response)=>{
    const product = await productRepository.findOneBy({id:parseInt(req.params.id,10)});
    
    productRepository.merge(product, req.body);

    const result = await productRepository.save(product);
    channel.sendToQueue('product_updated', Buffer.from(JSON.stringify(result)));
    return res.send(result);

});


app.delete('/api/products/:id',async(req: Request, res:Response)=>{
    const result = await productRepository.delete(req.params.id);
    channel.sendToQueue('product_deleted', Buffer.from(req.params.id));
    return res.send(result);
});

app.post('/api/products/:id/like',async(req: Request, res: Response)=>{
    const product = await productRepository.findOneBy({id:parseInt(req.params.id,10)});
    product.likes++;

    const result = await productRepository.save(product);
    return res.send(result);
});

console.log("listening port 8000");

app.listen(8000)
process.on("beforeExit", ()=>{
    console.log("closing");
    connection.close();
    
});
        })
    })
    
}).catch(error=>console.log(error));
