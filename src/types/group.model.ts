export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type GroupModel = {
    id?: string;
    name: string;
    permissions: Permission[];
};
