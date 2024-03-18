import {Component, Input, OnInit} from '@angular/core';
import {AbstractQuestionComponent} from '../abstract-question.component';
import {PluginService} from 'src/app/services/plugin.service';

@Component({
    selector: 'custom-question',
    templateUrl: './custom-question.component.html',
    styleUrls: ['./custom-question.component.scss'],
})
export class CustomQuestionComponent extends AbstractQuestionComponent implements OnInit{

    @Input() question: any;

    html: string;

    constructor(private pluginService: PluginService) {
        super();
    }

    async ngOnInit() {
        await this.pluginService.allPluginLoaded;
        this.html = this.pluginService.createEmbeddedIframeFromTemplateName(this.question.template);
        this.pluginService.$message.subscribe((message: any) => {
            if (message.event === 'user-responded') {
                this.userResponded(message.payload);
            }
        });
    }

    userResponded(answer) {
        this.userResponse.emit([answer]);
    }
}
