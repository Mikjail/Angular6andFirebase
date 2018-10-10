import { Subscription, Observable } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<Boolean>;

  constructor(private authService: AuthService,
    private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.loginForm = new FormGroup({
      username: new FormControl('', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required] }),
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    });
  }

  // ngOnDestroy() {
  //   if (this.loadingSubs) {
  //     this.loadingSubs.unsubscribe();
  //   }
  // }
}
