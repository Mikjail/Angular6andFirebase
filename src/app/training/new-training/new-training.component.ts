import { Component, OnInit } from '@angular/core';
import { TrainingService } from './../training.service';
import { NgForm } from '@angular/forms';
import { Exercise } from './../exercise.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<Boolean>;

  constructor(private trainingService: TrainingService,
    private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercices);
    this.trainingService.fetchAvailableExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExcercise(form.value.exercise);
  }
}
