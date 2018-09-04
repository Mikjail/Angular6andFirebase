import { TrainingRoutingModule } from './training-routing.module';
import { NgModule } from '@angular/core';

import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { SharedModule } from '../auth/shared/shared.module';



@NgModule({
    declarations: [
        TrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        CurrentTrainingComponent,
        StopTrainingComponent
    ],
    imports: [
        SharedModule,
        TrainingRoutingModule
    ],
    entryComponents: [StopTrainingComponent]
})

export class TrainingModule{}