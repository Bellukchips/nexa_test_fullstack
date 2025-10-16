"use client"
import { logout } from "@/actions/auth";
import { getAllTasks, updateTask } from "@/actions/task";
import PrivateRoute from "@/core/routes/PrivateRoute";
import { Task } from "@/types/task";
import { taskValidationSchema } from "@/validations/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import z from "zod";

export default function MyTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const router = useRouter();
    const form = useForm<z.infer<typeof taskValidationSchema>>({
        resolver: zodResolver(taskValidationSchema),
        defaultValues: {
            title: '',
            description: '',
            deadline: '',
            status: 'TO_DO',
            created_by: ''
        }
    });
    const { register, handleSubmit } = form;
    const [filter, setFilter] = useState({ status: "", deadline: "" });

    const onSubmit = async (values: z.infer<typeof taskValidationSchema>) => {
        setLoading(true);

    }

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAllTasks();
            setTasks(response.tasks || []);
        } catch (err) {
            setError('Failed to fetch tasks. Make sure the backend is running.');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();

    }, []);

    const openCreateModal = () => {
        setEditingTask(null);
        form.reset();
        setShowModal(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        form.reset({
            title: task.title,
            description: task.description || "",
            deadline: task.deadline,
            status: task.status,
            created_by: task.created_by
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        form.reset();
        setEditingTask(null);

    };
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.success) {
                router.push('/login');
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleDelete = (id: string) => {

    }
    const getStatusColor = (status: Task['status']): string => {
        switch (status) {
            case 'TO_DO':
                return 'bg-yellow-100 text-yellow-800';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800';
            case 'DONE':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
        try {
            const result = await updateTask(task.id, { status: newStatus, title: task.title, description: task.description, deadline: task.deadline, created_by: task.created_by });
            if (result.success) {
                fetchTasks();
            } else {
                setError(result.error || 'Failed to update task status');
            }
        } catch (err) {
            setError('Failed to update task status');
            console.error('Error updating status:', err);
        }
    }

    const handleFilter = async () => {
        setLoading(true);
        const { tasks } = await getAllTasks({
            status: filter.status,
            deadline: filter.deadline,
        });
        setTasks(tasks);
        setLoading(false);
    };

    const handleResetFilter = async () => {
        setFilter({ status: "", deadline: "" });
        setLoading(true);
        const { tasks } = await getAllTasks();
        setTasks(tasks);
        setLoading(false);
    };
    let content;
    if (loading) {
        content = (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
        );
    } else if (tasks.length === 0) {
        content = (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">Create your first task!</p>
            </div>
        );
    } else {
        content = (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-gray-900 flex-1">
                                {task.title}
                            </h3>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                            >
                                {task.status}
                            </span>
                        </div>

                        {task.description && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {task.description}
                            </p>
                        )}

                        <div className="mb-4">
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">Due:</span> {formatDate(task.deadline)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Change Status:
                            </label>
                            <select
                                value={task.status}
                                onChange={(e) =>
                                    handleStatusChange(task, e.target.value as Task["status"])
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TO_DO">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Completed</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => openEditModal(task)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <PrivateRoute>

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Management</h1>
                        <p className="text-gray-600">Nexa Tes Full Stack Developer</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <button
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                        >
                            + Add New Task
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 ml-5 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                        >
                            Log Out
                        </button>

                    </div>

                    <div className="flex flex-wrap gap-4 mb-10 bg-white p-4 rounded-lg shadow-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={filter.status}
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                <option value="TO_DO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                                type="date"
                                value={filter.deadline}
                                onChange={(e) => setFilter({ ...filter, deadline: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleFilter}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                        >
                            Filter
                        </button>

                        <button
                            onClick={handleResetFilter}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                        >
                            Reset
                        </button>
                    </div>

                    {content}


                    {showModal && (
                        <div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={closeModal}
                        >
                            <div
                                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-2xl font-bold mb-4">
                                    {editingTask ? 'Edit Task' : 'Create New Task'}
                                </h2>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Title */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('title')}
                                            required
                                            minLength={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter task title"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            {...register('description')}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter task description"
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Due Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            {...register('deadline')}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            {...register('status')}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">TODO</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Done</option>
                                        </select>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                                        >
                                            {editingTask ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </PrivateRoute>
    );
}