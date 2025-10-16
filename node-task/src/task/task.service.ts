import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskDto } from "./dtos/task.dto";
import { PrismaService } from "../prisma/prisma.service";
import { FilterDto } from "./dtos/filter.dto";

@Injectable()
export class TaskService {

    constructor(
        private readonly prisma: PrismaService
    ) { }


    async createTask(dto: TaskDto, userId: string) {
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status || 'TO_DO',
                deadline: dto.deadline,
                created_by: dto.created_by,
                user_id: userId
            },
        });

        return task;
    }
    async updateTask(userId: string, taskId: string, dto: TaskDto) {
        const taskExist = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                user_id: userId
            }
        });

        if (!taskExist) throw new NotFoundException('Task not found');

        const updateTask = await this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                ...(dto.title && { title: dto.title }),
                ...(dto.description && { description: dto.description }),
                ...(dto.status && { status: dto.status }),
                ...(dto.deadline && { deadline: dto.deadline }),
                ...(dto.created_by && { created_by: dto.created_by }),
            },
        });

        return updateTask;
    }
    async deleteTask(userId: string, taskId: string) {
        const taskExist = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                user_id: userId
            }
        });

        if (!taskExist) throw new NotFoundException('Task not found');

        await this.prisma.task.delete({
            where: {
                id: taskId,
            },
        });

        return { data: { message: 'Task deleted successfully' } };
    }
    async getAllTask(userId: string, filterDto: FilterDto) {
        const { status, deadline } = filterDto || {};

        const whereClause: any = {
            user_id: userId,
        }

        if (status) {
            whereClause.status = status;
        }
        
        if(deadline) {
            whereClause.deadline = deadline;
        }   

        const tasks = await this.prisma.task.findMany({
            where: whereClause,

        });

        return tasks
    }
}