import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class RegisterDto {
    @IsNotEmpty() @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Name must not exceed 100 characters' })
    name: string;

    @IsNotEmpty() @IsString()
    @MinLength(5, { message: 'Name must be at least 5 characters long' })
    @MaxLength(20, { message: 'Name must not exceed 20 characters' })
    username: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
    password: string;

}