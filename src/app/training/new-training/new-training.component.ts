import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  Subscription } from 'rxjs';

import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';
import { UIService } from '../../auth/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubscriptions: Subscription[] = [];
  isLoading = true;

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit() {
    console.log(this.isLoading);
    this.exerciseSubscriptions.push(this.uiService.loadingStateChanged.subscribe(isLoadingState => {
      console.log(isLoadingState);
      this.isLoading = isLoadingState;
    }));
    this.exerciseSubscriptions.push(this.trainingService.exercisesChanged.subscribe(exercises => this.exercises = exercises));
    this.trainingService.fetchAvailableExercises();
  }
  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExcercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscriptions.length > 0 ) {
      this.exerciseSubscriptions.forEach(element => element.unsubscribe() );
    }
  }
}
