import { Subject } from 'rxjs/Subject';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from './shared/ui.service';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;
    private isAuthenticated: Boolean = false;
    constructor(private router: Router,
        private afAuth: AngularFireAuth,
        private trainingServices: TrainingService,
        private uiService: UIService){}

    async registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        try {
            await this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password);
            this.uiService.loadingStateChanged.next(false);
        } catch (error) {
            this.uiService.showSnackBar(error.message, null, 3000);
            this.uiService.loadingStateChanged.next(false);
        }
    }

   async login(authData: AuthData) {
       this.uiService.loadingStateChanged.next(true);
        try {
            await this.afAuth.auth.signInWithEmailAndPassword(authData.email,authData.password);
            this.user = { email : authData.email, userId: '13221'};
            this.uiService.loadingStateChanged.next(false);
        } catch (error) {
            this.uiService.showSnackBar(error.message, null, 3000);
            this.uiService.loadingStateChanged.next(false);
        }
    }

    initAuthListener() {
        this.afAuth.authState.subscribe( user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.isAuthenticated = false;
                this.trainingServices.cancelSubscriptions();
                this.authChange.next(false);
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

    isAuth() {
        return this.isAuthenticated;
    }


}
