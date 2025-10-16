import axios from "axios";
import type { ApiResponse } from "../types/api-response";
import type { TaskInput } from "../types/task-input";
import type { Task } from "../types/task";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getAllTasks(query: any): Promise<{ tasks: Task[]; success: boolean }> {
    try {
        const response = await axios.get<ApiResponse<Task[]>>(`${API_URL}/task/all`);
        return {
            tasks: response.data.data || [],
            success: true,
        };
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return { tasks: [], success: false };
    }
}


export async function createTask(task: TaskInput): Promise<{ task: Task | null; success: boolean; error?: string }> {
    try {
        const response = await axios.post<ApiResponse<Task>>(`${API_URL}/task/create`, task);
        return { task: response.data.data, success: true };
    } catch (error: any) {
        console.error("Error creating task:", error);
        return {
            task: null,
            success: false,
            error: error.response?.data?.error || 'Failed to create task'
        };
    }
}

export async function updateTask(id: string, task: Partial<TaskInput>): Promise<{ task: Task | null; success: boolean; error?: string }> {
    try {
        const response = await axios.put<ApiResponse<Task>>(`${API_URL}/task/update/${id}`, task);
        return { task: response.data.data, success: true };
    } catch (error: any) {
        console.error(`Error updating task ${id}:`, error);
        return {
            task: null,
            success: false,
            error: error.response?.data?.error || 'Failed to update task'
        };
    }
}

export async function deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await axios.delete<ApiResponse<string>>(`${API_URL}/task/delete/${id}`);
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting task ${id}:`, error);
        return {
            success: false,
            error: error.response?.data?.error || 'Failed to delete task'
        };
    }
}