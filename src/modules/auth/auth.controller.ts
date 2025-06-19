import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto, RegisterUserDto, TokenDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly NewUser:AuthService){}
    
    @Post("register")
    register(@Body() payload:RegisterUserDto){
        return this.NewUser.register(payload)
    }

    @Post("login")
    login(@Body() payload:LoginUserDto){

        return this.NewUser.login(payload)
    }

    @Post("check-token")
    checkToken(@Body() payload:TokenDto){
        return this.NewUser.checkToken(payload)
    }
}
