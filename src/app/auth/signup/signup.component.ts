import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './../auth.service';
import { UIService } from '../shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate = new Date();
  isLoading = false;
  private loadingSubs: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
   }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoadingState=>{
      this.isLoading = isLoadingState;
    });
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.authService.registerUser({
      email: form.value.username,
      password: form.value.password
    });
  }
  ngOnDestroy() {
  if(this.loadingSubs){
      this.loadingSubs.unsubscribe();
    }
  }
}
