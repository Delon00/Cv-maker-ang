import Cv from './cv.interface';

export default interface Template {
    id: string;
    name: string;
    description?: string;
    previewUrl?: string;
    cvs: Cv[];
    createdAt: Date;
    updatedAt: Date;
}