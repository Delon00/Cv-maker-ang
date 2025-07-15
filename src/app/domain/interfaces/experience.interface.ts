export default interface Experience {
    id: string;
    cvId: string;
    company: string;
    position: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
}
