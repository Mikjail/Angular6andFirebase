import { Exercise } from './exercise.model';
import { Action } from '@ngrx/store';

export const SET_AVAILABLE_TRAININGS = '[Training] Set Available';
export const SET_FINISH_TRAININGS = '[Training] Set FinishTraining';
export const START_TRAINING = '[Training] Start Training';
export const STOP_TRAINING = '[Training] Stop Training';

export class SetAvailableTrainings implements Action {
    readonly type = SET_AVAILABLE_TRAININGS;

    constructor(public payload: Exercise[]) {}
}


export class SetFinishTrainings implements Action {
    readonly type = SET_FINISH_TRAININGS;

    constructor(public payload: Exercise[]) {}
}

export class StartTraining implements Action {
    readonly type = START_TRAINING;

    constructor(public payload: string) {}
}

export class StopTraining implements Action {
    readonly type = STOP_TRAINING;
}

export type TrainingActions =
    SetAvailableTrainings |
    SetFinishTrainings |
    StartTraining |
    StopTraining;
