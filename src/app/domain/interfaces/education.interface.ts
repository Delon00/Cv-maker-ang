export default interface Education {
    id: string;
    cvId: string;
    school: string;
    degree: string;
    field?: string;
    startDate: Date;
    endDate?: Date;
}
