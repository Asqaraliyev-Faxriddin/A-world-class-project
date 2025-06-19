import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.model';
import { LoginUserDto, RegisterUserDto, TokenDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private NewUserService:typeof User,private jwtService:JwtService){}


  async generateToken(payload:any,natija?:boolean){
        const accessToken=await  this.jwtService.signAsync({...payload,type:"accessToken"})
        const refreshToken=await  this.jwtService.signAsync({...payload,type:"refreshToken"})
        if(!natija){
            return {
                accessToken
            }
        }
        return{
            accessToken,
            refreshToken
        }
    }



    async register(payload:Required<RegisterUserDto>){

        let User =  await this.NewUserService.findOne({where:{username:payload.username}}) 
        let email =  await this.NewUserService.findOne({where:{email:payload.email}}) 
        if(User ) throw new ConflictException("username already")
        if(email ) throw new ConflictException("email already")

        let hashPassword = await bcrypt.hash(payload.password,10)



        let data2 = await this.NewUserService.create({...payload,password:hashPassword})

        let tokens = await this.generateToken({id:data2.dataValues.id,role:data2.dataValues.role},true)
        return {
           tokens,
           data:data2
        }
    }

    
    async login(payload:Required<LoginUserDto>){
        let User =  await this.NewUserService.findOne({where:{username:payload.username}}) 
        if(!User) throw new NotFoundException("User not found")
        let compare = await bcrypt.compare(payload.password,User.dataValues.password)

        if(!compare) throw new NotFoundException("Password error")

        let tokens = await this.generateToken({id:User.dataValues.id,role:User.dataValues.role},true)

        return {
            tokens,
            data:User
        }
            

    }

    async checkToken(tokenDto: Required<TokenDto>) {
        let payload = await this.jwtService.verifyAsync(tokenDto.token);
    
        let tokens = await this.generateToken({ id: payload.id, role: payload.role }, false);
    
        return {
            ...tokens
        };
    }
    
}


