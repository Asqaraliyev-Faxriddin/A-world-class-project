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