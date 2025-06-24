import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.model';
import { LoginUserDto, RegisterUserDto, reset_password, TokenDto, UserVerify, verifyDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { MailerService } from 'src/common/mailer/mailer.service';
import { Checktoken } from 'src/global/type/user';
import { JwtAccesToken, JwtRefreshToken } from 'src/common/utils/jwt-auth';
import { RediseService } from 'src/common/redise/redise.service';



@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private UsermodelService:typeof User,private jwtService:JwtService,private Mailermodel:MailerService,
    private redic : RediseService
){}


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

        let code = Math.floor(Math.random() * 100000);

        this.Mailermodel.createEmail(payload.email,"Saitdan foydalanish uchun",code)
        await  this.redic.set(`register:${payload.email}`,JSON.stringify({...payload,code}),400)    

        return  `shu emailingizga xabar yuborildi. ${payload.email} `
           
        
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

    async verify(payload:verifyDto){

            let text =await  this.redic.get(`register:${payload.email}`)
            if(!text) throw new BadRequestException("user not found or code expire")
            
            let data = JSON.parse(text)
            
            if(data.code !== payload.code) throw new BadRequestException("Incorrect code")

            let hashPassword = await bcrypt.hash(data.password,10)

            let createUser = await this.UsermodelService.create({
                email: payload.email,
                username: data.username, 
                password: hashPassword
              })
            this.redic.del(`register:${payload.email}`)
            let tokens = await this.generateToken({id:createUser.dataValues.id,role:createUser.dataValues.role},true)

            return {
                tokens,
                createUser
            }
         }

         async sendVerify(payload:UserVerify){
    
            let code = Math.floor(Math.random() * 100000);
    
            this.Mailermodel.createEmail(payload.email,"Saitdan foydalanish uchun",code)
            await  this.redic.set(`password:${payload.email}`,JSON.stringify({...payload,code}),400)    
    
            return  {message:`shu emailingizga xabar yuborildi. ${payload.email} `}
            
        }

        async reset_password(payload:reset_password){
    
            let text =await  this.redic.get(`password:${payload.email}`)    
            if(!text) throw new BadRequestException("User not found or User code expire")
            
            let userdata = JSON.parse(text)
            if(userdata.code !== payload.code)
            await this.UsermodelService.update({password:payload.password},{where:{email:payload.email}})
    
            return  `User update `
               
        }
    
    }


