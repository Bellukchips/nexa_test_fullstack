import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../core/decorator/current-user.decorator";
import { TaskDto } from "./dtos/task.dto";
import { TaskService } from "./task.service";
import { JwtAuthGuard } from "../core/guard/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller('task') 
export class TaskController {

    constructor(
        private readonly taskService: TaskService
    ){}

    @Post('create')
    create(@CurrentUser() user:any, @Body() dto: TaskDto){
        return this.taskService.createTask(dto, user.user_id);
    }  

    @Put('update/:taskId')
    update(@CurrentUser() user:any, @Body() dto: TaskDto, @Param('taskId') taskId: string){
        return this.taskService.updateTask(user.user_id, taskId, dto);
    }

    @Delete('delete/:taskId')
    delete(@CurrentUser() user:any, @Param('taskId') taskId: string){
        return this.taskService.deleteTask(user.user_id, taskId);
    }

    @Get('all')
    getAll(@CurrentUser() user:any, @Query() filterDto: any){
        return this.taskService.getAllTask(user.user_id, filterDto);
    }
}