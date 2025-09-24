import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormsModule,HttpClientModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']

})

export class LoginComponent {
  usuario = {
    correoElectronico: '',
    contrasena: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:8080/api/login', this.usuario).subscribe({
      next: (data: any) => {
        localStorage.setItem('usuarioDni', data.dni);
        alert('Inicio de sesión exitoso');

        if (data.tipoUsuario === 'Administrador') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/inicio']);
        }
      },
      error: (err) => {
  if (err.status === 403) {
    alert('Usuario inactivo. Comuníquese con el administrador.');
  } else {
    alert('Correo o contraseña incorrectos');
  }
}

      
    });
  }


  
}