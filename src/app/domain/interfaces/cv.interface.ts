import User from '@interfaces/user.interface';
import Template from '@interfaces/template.interface';
import Education from '@interfaces/education.interface';
import Experience from '@interfaces/experience.interface';
import Skill from '@interfaces/skill.interface';

export default interface Cv {
    id: string;
    userId: string;
    title?: string;
    templateId: string;
    data: any; 
    user: User;
    template: Template;
    educations: Education[];
    experiences: Experience[];
    skills: Skill[];
    createdAt: Date;
    updatedAt: Date;
}