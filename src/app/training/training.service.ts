import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject'; //rxjs6 should be imported rxjs instead rxjs/Subject
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {Subscription } from 'rxjs';
import { UIService } from '../auth/shared/ui.service';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercise: Exercise[] = [];
    private runningExcercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService){}

    fetchAvailableExercises() {
      this.uiService.loadingStateChanged.next(true);
       this.fbSubs.push(this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
               return {
                 id: doc.payload.doc.id,
                 ...doc.payload.doc.data()
               };
             });
           })
         ).subscribe((exercises: Exercise[]) => {
            this.uiService.loadingStateChanged.next(false);
            this.availableExercise = exercises;
            this.exercisesChanged.next([...this.availableExercise]);
        }, error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar('fetching Exercises failed', null, 3000);
            this.exerciseChanged.next(null);
        }));
    }

    startExcercise(selectedId: string) {
        // this.db.doc('availableExercise/' + selectedId).update({lastSelected : new Date() });
        this.runningExcercise = this.availableExercise.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({...this.runningExcercise});
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExcercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExcercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExcercise,
            duration: this.runningExcercise.duration * (progress / 100),
            calories: this.runningExcercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExcercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return {... this.runningExcercise};
    }

    fetchCompletedOrCanceledExercises() {
        this.fbSubs.push(this.db.collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
        })); // could add , error => {
    }
    
    cancelSubscriptions() {
        this.fbSubs.forEach( sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}
