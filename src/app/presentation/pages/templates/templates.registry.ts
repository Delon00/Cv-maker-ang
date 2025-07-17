import { TemplatesService } from '@services/templates.service';
import { SimpleComponent } from '@pages/templates/cvs/simple/simple.component';


export function registerAllTemplates(templateService: TemplatesService) {
    templateService.registerTemplate('Simple', SimpleComponent);


}
