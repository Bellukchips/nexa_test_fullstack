import { IsNotEmpty, IsString, Matches, } from "class-validator"

export class LoginDto {

    @IsNotEmpty() @IsString()
    username: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
    password: string;

}