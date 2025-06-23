import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './common/models/user.model';
import { MailerModule } from './common/mailer/mailer.module';
import { RediseModule } from './common/redise/redise.module';

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
        host: config.get<string>('DB_HOST') || "localhost" , 
        port: config.get<number>('DB_PORT') || 5432,
        username: config.get<string>('DB_USERNAME') || "postgres" ,
        password: config.get<string>('DB_PASSWORD') || "11201111" ,
        database: config.get<string>('DB_NAME') || "Redis" ,
        autoLoadModels: true,
        synchronize: true,
        models:[User]
      }),
    }),

    AuthModule,
    UserModule,
    MailerModule,
    RediseModule,
  ],
})
export class AppModule {}
