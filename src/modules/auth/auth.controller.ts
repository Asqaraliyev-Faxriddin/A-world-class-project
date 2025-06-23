import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto, RegisterUserDto, reset_password, sendVerify, TokenDto, UserVerify, verifyDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly usermodel:AuthService){}
    
    @Post("register")
    register(@Body() payload:RegisterUserDto){
        return this.usermodel.register(payload)
    }

    @Post("login")
    login(@Body() payload:LoginUserDto){

        return this.usermodel.login(payload)
    }

    @Post("check-token")
    checkToken(@Body() payload:TokenDto){
        return this.usermodel.checkToken(payload)
    }

    @Post("user-verify")
    UserVerify(@Body() payload:verifyDto){

        return this.usermodel.verify(payload)
    }

    @Post("send-verify")
    sendVerify(@Body() payload:UserVerify){

        return this.usermodel.sendVerify(payload)

    }

    @Post("reset_password")
    reset_password(@Body() payload:reset_password){

        return this.usermodel.reset_password(payload)

    }

}
