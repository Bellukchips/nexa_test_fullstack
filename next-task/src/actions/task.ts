import axios from "axios";
import type { ApiResponse } from "../types/api-response";
import type { TaskInput } from "../types/task-input";
import type { Task } from "../types/task";
import { getToken } from "@/core/token";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getAllTasks(
    filters?: { status?: string; deadline?: string }
): Promise<{ tasks: Task[]; success: boolean }> {
    try {
        const token = getToken();

        const params = new URLSearchParams();
        if (filters?.status) params.append("status", filters.status);
        if (filters?.deadline) {
            const isoDate = new Date(filters.deadline).toISOString();
            console.log(isoDate);
            params.append("deadline", isoDate);
        }


        const url = `${API_URL}/task/all${params.toString() ? `?${params}` : ""}`;

        const response = await axios.get<ApiResponse<Task[]>>(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

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
        const token = getToken();
        const response = await axios.post<ApiResponse<Task>>(`${API_URL}/task/create`, task, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
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
        const token = getToken();
        const response = await axios.put<ApiResponse<Task>>(`${API_URL}/task/update/${id}`, task, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
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
        const token = getToken();
        await axios.delete<ApiResponse<string>>(`${API_URL}/task/delete/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting task ${id}:`, error);
        return {
            success: false,
            error: error.response?.data?.error || 'Failed to delete task'
        };
    }
}