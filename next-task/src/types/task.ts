export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
    created_by: string;
}
