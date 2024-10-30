import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationRoutes } from '@constants/navigation-routes';
import { AuthService } from '@services/internal/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';

@Component({
  selector: 'BancoRopa-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, CheckboxModule, ButtonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {

  loginForm: FormGroup
  loading = signal(false)

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService, private messageS: MessageService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    this.loading.set(true)
    this.auth.login(this.loginForm.value).pipe(
      finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          switch(this.auth.userDetails?.role){
            case 'ROLE_BANK_EMPLOYEE':{
              this.router.navigateByUrl(NavigationRoutes.BANK_EMPLOYEE_HOME)
              break
            }
            case 'ROLE_WARDROBE_EMPLOYEE':{
              this.router.navigateByUrl(NavigationRoutes.WARDROBE_EMPLOYEE_HOME)
              break
            }
            case 'ROLE_CLIENT':{
              this.router.navigateByUrl(NavigationRoutes.CLIENT_HOME)
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this.messageS.add({
            severity: 'error',
            summary: `Usuario o contraseña incorrectos`
          })
        }
    })
  }
}
