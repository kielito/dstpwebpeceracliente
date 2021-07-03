import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios-abm',
  templateUrl: './usuarios-abm.component.html',
  styleUrls: ['./usuarios-abm.component.css']
})
export class UsuariosAbmComponent implements OnInit {

  user={  Usuario:"", Nombre:"", Apellido:"", Email:"", Password:"", Repassword:"", Perfil:""};  
  usuarios:any = []; //variable del componente, disponible para todas las clases (la puedo usar desde el HTML)
  revelar:boolean= true; //para mostrar (true) u ocultar (false) en el formulario  
  errorUsuario=0;
  errorNombre=0;
  errorApellido=0;
  errrorPassword=0;
  errorRePassrword=0;
  errorEmail=0;
  errorPerfil=0;
  confirmacion:boolean = false;
  error:boolean = false;
  mensaje = "";

  constructor(private usuariosService:UsuariosService) { }

  ngOnInit(): void {
    this.usuariosService.logued$.emit();
    this.confirmacion=false;
    this.error=false;
    this.usuariosService.listarUsuarios().subscribe( //se utiliza subscribe ya que el metodo trabaja con la base de datos
			//res => console.log(res), //Parametro 1: si se ejecuto bien se informa
      res => { 
        this.usuarios = res;
        for (let i=0;i<this.usuarios.length;i++) {            
          delete this.usuarios[i].Password;
        };
      },
			err => console.log(err) //Parametro 2: si hubo un error lo informo
		) //los log se ven en la consola del navegador    
  }

  registrar(){		
    this.usuariosService.registrar(this.user).subscribe(
      res => {        
        this.mensaje = "agregado";
        this.confirmacion=true;
        this.recargarForm();
      },
      err => {
        this.error=true;
        this.mensaje = err.error.message;
      }
    )
    
    this.ngOnInit(); 
  }

  editar(usuario:any){
    this.confirmacion=false;
    this.error=false;
    console.log(usuario)
    if(!this.verificarEdit(usuario))
    {
      this.ngOnInit();      
      this.mensaje = "Verifique los datos ingresados";
      this.error=true;
    } else {    
      
      this.usuariosService.actualizarUsuario(usuario.Id, usuario).subscribe(
        res => {        
          this.ngOnInit();
          this.mensaje = "actualizado";
          this.confirmacion=true;
        },
        err => {
          this.error=true;
          this.mensaje = err.error.message;
        }
      )
    }
  }

  eliminar(usuario:any){
    this.confirmacion=false;
    this.error=false;
    this.usuariosService.eliminarUsuario(usuario.Id).subscribe(
      res => {
        this.mensaje = "eliminado";
        this.confirmacion=true;
      },
      err => {
        this.error=true;
        this.mensaje = err.error.message;
      }
    )
    this.ngOnInit();
  }

  verificarForm():boolean{    
    this.errorUsuario=this.verificarUsuario(this.user.Usuario);
    this.errorNombre=this.verificarNombre(this.user.Nombre);
    this.errorApellido=this.verificarApellido(this.user.Apellido);
    this.errrorPassword=this.verificarPassword(this.user.Password);
    this.errorRePassrword=this.verificarRePassword(this.user.Password, this.user.Repassword);
    this.errorEmail=this.verificarEmail(this.user.Email);
    this.errorPerfil=this.verificarRol(this.user.Perfil);

    if(  (this.errorUsuario+this.errorNombre+this.errorApellido+this.errrorPassword+this.errorRePassrword+this.errorEmail+this.errorPerfil)>0){
      return false;
    }
    return true;
  }

  verificarEdit(usuario:any):boolean{    
    this.errorUsuario=this.verificarUsuario(usuario.Usuario);
    this.errorNombre=this.verificarNombre(usuario.Nombre);
    this.errorApellido=this.verificarApellido(usuario.Apellido);
    this.errorEmail=this.verificarEmail(usuario.Email);
    this.errorPerfil=this.verificarRol(usuario.Perfil);

    if(usuario.Password)
    {
      this.errrorPassword=this.verificarPassword(usuario.Password);
      if(  (this.errorUsuario+this.errorNombre+this.errorApellido+this.errrorPassword+this.errorEmail+this.errorPerfil)>0){        
        return false;
      }
      return true;
    } else {
      if( (this.errorUsuario+this.errorNombre+this.errorApellido+this.errorEmail+this.errorPerfil)>0){
        return false;
      }
      return true;
    }
  }

  verificarUsuario(usuario:string):number {
    const patron=/^[a-z]{3,20}$/;
    if(usuario.length==0)
      return 1;
    if(usuario.length>20)
      return 2;
    if(!patron.test(usuario))
      return 3;
    return 0;
  }

  onBlurUsuario(event: any){    
    this.errorUsuario=this.verificarUsuario(event);  
  }
 
  verificarNombre(nombre:string):number {
    //const patron=/^[^ ][A-Za-zÀ-ÿ\s]+[^ ]{3,20}$/;
    const patron=/(^[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})(\s[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})*$/;
    if(nombre.length==0)
      return 1;
    if(nombre.length>20)
      return 2;
    if(!patron.test(nombre))
      return 3;
    return 0;
  }
  
  onBlurNombre(nombre: any){    
    this.errorNombre=this.verificarNombre(nombre);    
  }

  verificarApellido(apellido:string):number {
    const patron=/(^[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})(\s[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})*$/;
    if(apellido.length==0)
      return 1;
    if(apellido.length>20)
      return 2;
    if(!patron.test(apellido))
      return 3;
    return 0;
  }

  onBlurApellido(apellido: any){    
    this.errorApellido=this.verificarApellido(apellido);
  }
  
  verificarPassword(password:any): number {
    const patron=/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,20}$/;
    if(password.length==0)
      return 1;
    if(password.length>20)
      return 2;
    if(!patron.test(password))
      return 3;
    return 0;
  }

  onBlurPassword(passqord: any){    
    this.errrorPassword=this.verificarPassword(passqord);
  }
  
  verificarRePassword(password:any, repassword:any): number {
    if(password!=repassword){
      return 1;
    }
    return 0;
  }
  
  onBlurRePassword(password: any, repassword: any){    
    this.errorRePassrword=this.verificarRePassword(password, repassword);
  }
  
  verificarEmail(email:any): number {
    const patron=/^[a-z0-9\_\_.]{1,30}@[a-z0-9]{1,10}(\.[a-z]{2,3}){1,3}$/;
    if(email.length==0)
      return 1;
    if(email.length>50)
      return 2;
    if(!patron.test(email))
      return 3;
    return 0;
  }

  onBlurEmail(email: any){    
    this.errorEmail=this.verificarEmail(email);
  }

  verificarRol(perfil:any): number {
    if(perfil!="Admin" && perfil!="Usuario"){
      return 1;
    }
    return 0;
  }

  onBlurRol(rol: any){    
    this.errorPerfil=this.verificarRol(rol);
  }

  limpiarDatos(){
    this.limpiarUsuario();
    this.limpiarNombre();
    this.limpiarApellido();
    this.limpiarPassword();
    this.limpiarRePassword();
    this.limpiarEmail();
  }

  limpiarUsuario() {    
    this.user.Usuario = "";
    this.errorUsuario = 0;    
  }

  limpiarNombre() {
    if (this.errorNombre > 0) {
      this.user.Nombre = "";
      this.errorNombre = 0;
    }
  }

  limpiarApellido() {
    if (this.errorApellido > 0) {
      this.user.Apellido = "";
      this.errorApellido = 0;
    }
  }

  limpiarPassword() {
    if (this.errrorPassword > 0) {
      this.user.Password = "";
      this.errrorPassword = 0;
    }
  }

  limpiarRePassword() {
    if (this.errorRePassrword > 0) {
      this.user.Repassword = "";
      this.errorRePassrword = 0;
    }

  }

  limpiarEmail() {
    if(this.errorEmail>0){
      this.user.Email = "";
      this.errorEmail = 0;
    }
  }

  recargarForm(){    
    this.user.Usuario="";
    this.user.Nombre="";
    this.user.Apellido="";
    this.user.Password="";
    this.user.Repassword="";
    this.user.Email="";
	  this.mensaje="";
  }

  logout(){
    //Es de notar que la redireccion del metodo logOut podria haberse hecho aqui y dejar el servicio lo mas acotado posible.    
    this.usuariosService.logOut();
  }

}
