import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsJWT, IsNotEmpty, IsString, length, Length } from "class-validator"

export class RegisterUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username:String

    @ApiProperty()
    @Length(8,16)
    @IsNotEmpty()
    password:string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email:string

}

export class LoginUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username:String

    @ApiProperty()
    @Length(8,16)
    @IsNotEmpty()
    password:string


   

}


export class TokenDto {

    @ApiProperty()
    @IsJWT()
    token:string
}

export class verifyDto {
    @IsNotEmpty()
    code:number

    @IsNotEmpty()
    @IsEmail()
    email:string
}

export class sendVerify{

    @IsEmail()
    email:string
    
    code :number
}

export class UserVerify{
    
    @IsEmail()
    email:string

  
}

export class reset_password{

    @IsEmail()
    email:string

    @IsNotEmpty()
    code:number

    @IsNotEmpty()
    password:string

}