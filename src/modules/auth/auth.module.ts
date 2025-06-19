import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/utils/jwt-auth';

@Module({
    imports:[SequelizeModule.forFeature([User]),
    JwtModule.register(JwtAccesToken)
],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule {}
