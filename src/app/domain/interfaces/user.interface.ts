import Cv  from '@interfaces/cv.interface';

export default interface User {
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    plan?: string;
    cvs: Cv[];
    createdAt: Date;
    updatedAt: Date;
}