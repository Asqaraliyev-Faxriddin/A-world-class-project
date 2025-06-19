import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './common/models/user.model';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOS') , 
        port: config.get<number>('DB_POT'),
        username: config.get<string>('DB_USERNAME') ,
        password: config.get<string>('DB_PASSWORD')  ,
        database: config.get<string>('DB_NAME') ,
        autoLoadModels: true,
        synchronize: true,
        models:[User]
      }),
    }),

   
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
