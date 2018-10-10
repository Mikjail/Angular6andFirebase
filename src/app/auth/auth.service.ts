import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as  UI from './../shared/ui.actions';
import * as Auth from './auth.actions';
@Injectable()
export class AuthService {
    private user: User;
    constructor(private router: Router,
        private afAuth: AngularFireAuth,
        private trainingServices: TrainingService,
        private uiService: UIService,
        private store: Store<fromRoot.State>) {}

    async registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        try {
            await this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password);
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
        } catch (error) {
            this.uiService.showSnackBar(error.message, null, 3000);
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
        }
    }

   async login(authData: AuthData) {
    //    this.uiService.loadingStateChanged.next(true);
       this.store.dispatch(new UI.StartLoading());
        try {
            await this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password);
            this.user = { email : authData.email, userId: '13221'};
            this.store.dispatch(new UI.StopLoading());
            // this.uiService.loadingStateChanged.next(false);
        } catch (error) {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(error.message, null, 3000);
            // this.uiService.loadingStateChanged.next(false);
        }
    }

    initAuthListener() {
        this.afAuth.authState.subscribe( user => {
            if (user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training']);
            } else {
                this.store.dispatch(new Auth.SetUnauthenticated());
                this.trainingServices.cancelSubscriptions();
                this.router.navigate(['/login']);
            }
        });
    }

    logout() {
       this.afAuth.auth.signOut();
    }

    getUser() {
        return { ... this.user };
    }

}
