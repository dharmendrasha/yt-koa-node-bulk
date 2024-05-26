import Koa from 'koa'
import Router from '@koa/router'
import { z, ZodError } from 'zod'
import { q } from './q'
import { serverAdapter } from './board'



export const query = z.object({
    image_url: z.string().url()
})

const app = new Koa()

app.use(serverAdapter.registerPlugin())

const router = new Router()

router.get('/queue-add', async (ctx, next) => {
    try{
        // add this to the queue 
        const qry = await query.parseAsync(ctx.query)


        // add to the queue
        await q.add({image_url: qry.image_url}, {timeout: 60000, attempts: 5})

        // return success
        return ctx.body = {
            status: true,
            message: 'queue added'
        }
    }catch(e){
        if(e instanceof ZodError){
            ctx.status = 422
            ctx.body = 
            {
                status: false,
                message: 'invalid data',
                body: {...e.errors.at(0)}
            }

            return ctx
        }

        console.error(e)
        ctx.status = 500
        ctx.body = {
            status: false,
            message: 'unexpected failure',
        }

        return ctx
        
    }
    
})

app.use(router.routes()).use(router.allowedMethods());

const port = Number(process.env['PORT'] || 3000)

app.listen(port, '0.0.0.0', () => {
    console.log(`app is running on PORT=${port}`)
})