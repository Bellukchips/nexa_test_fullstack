import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule
    ],
    controllers: [
        TaskController
    ],
    providers: [
        TaskService
    ],

})

export class TaskModule { }