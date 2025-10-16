import {  IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TaskStatus } from "../../core/enum/task_status";

export class TaskDto {
    @IsNotEmpty() @IsString()
    title: string;

    @IsNotEmpty() @IsString()
    description: string;

    @IsNotEmpty() @IsEnum(TaskStatus, { message: 'Invalid status' })
    status: TaskStatus;

    @IsNotEmpty() @IsString()
    deadline: string

    @IsNotEmpty() @IsString()
    created_by: string

}