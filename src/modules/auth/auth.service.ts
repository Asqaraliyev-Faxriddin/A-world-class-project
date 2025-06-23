import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.model';
import { LoginUserDto, RegisterUserDto, TokenDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { MailerService } from 'src/common/mailer/mailer.service';
import { Checktoken } from 'src/global/type/user';
import { JwtAccesToken, JwtRefreshToken } from 'src/common/utils/jwt-auth';



@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private UsermodelService:typeof User,private jwtService:JwtService,private Mailermodel:MailerService){}



    async generateToken(payload:Required<Checktoken>,status?:boolean){
        const accessToken=await  this.jwtService.signAsync({...payload},JwtAccesToken)
        const refreshToken=await  this.jwtService.signAsync({...payload},JwtRefreshToken)
        
        if(!status){
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

        let User =  await this.UsermodelService.findOne({where:{username:payload.username}}) 
        let email =  await this.UsermodelService.findOne({where:{email:payload.email}}) 
       
        if(User ) throw new ConflictException("username already")
        if(email ) throw new ConflictException("email already")

        let hashPassword = await bcrypt.hash(payload.password,10)
        let code = Math.floor(Math.random() * 100000);

        await this.Mailermodel.createEmail(payload.email,"Saitdan foydalanish uchun",code)


        let createUser = await this.UsermodelService.create({...payload,password:hashPassword})

        let tokens = await this.generateToken({id:createUser.dataValues.id,role:createUser.dataValues.role},true)
        return {
           tokens,
           data:createUser
        }
    }

    
    async login(payload:Required<LoginUserDto>){
    
        let User =  await this.UsermodelService.findOne({where:{username:payload.username}}) 
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
    
        try {
         let payload = await this.jwtService.verifyAsync(tokenDto.token);
         let tokens = await this.generateToken({ id: payload.id, role: payload.role }, false);
            
            return {
                ...tokens
                };
         } catch (error) {
            throw new UnauthorizedException(error.name)
         }
        
         }
    
    }


