import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { OnReadOpts } from 'net';

@Injectable()
export class RediseService implements OnModuleInit{
    private client:Redis

    onModuleInit() {
        this.client =new Redis()
    }
    
    async get(key:string){
        return await this.client.get(key)
    }


    async set(key:string,code:string,second:number){
        await this.client.set(key,code,"EX",second)

    }

    async del(key:string){
        await this.client.del(key)

    }
    



}
