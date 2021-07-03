import { Component, OnInit } from '@angular/core';
import { ComentariosService } from '../../../services/comentarios.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-comentarios-abm',
  templateUrl: './comentarios-abm.component.html',
  styleUrls: ['./comentarios-abm.component.css']
})
export class ComentariosAbmComponent implements OnInit {

  constructor(private comentariosService:ComentariosService, private usuariosService: UsuariosService) { }

  coment = { Usuario:"", Comentario:"", Titulo:"" };

  confirmacion:boolean = false;
  error:boolean = false;
  mensaje = "";
  errorComentario=0;
  errorTitulo=0;
  usuario:any = [];

  archivoSeleccionado:any;
  file:any;
  fotos:any = [];

  ngOnInit(): void {
    this.usuariosService.logued$.emit();
    this.recargarForm();

     //LISTAR FOTOS
     this.comentariosService.listarArchivos().subscribe(
      res => {
        this.fotos = res;
      },        
        err => {
          this.error=true;
          this.mensaje = err.error.message;  
      }
    )  
  }

  //Fotos
  
  SeleccionArchivo(event: any): void{
    if(event.target.files && event.target.files[0]){
      this.file = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.archivoSeleccionado = reader.result;
      reader.readAsDataURL(this.file);   
      
      console.log(this.file);
    }
  }

  cargarArchivo(){
    this.comentariosService.cargarArchivos(this.file).subscribe(
      res => {
        this.ngOnInit();
        this.mensaje = "cargado";
        this.confirmacion=true;
      },        
        err => {
          this.error=true;
          this.mensaje = err.error.message;
      }
    )
  }

  eliminar(archivo: any): void{    
    this.comentariosService.eliminarArchivo(archivo.Id).subscribe(
      res => {
        this.ngOnInit();
        this.mensaje = "eliminado";
        this.confirmacion=true;
      },        
        err => {
          this.error=true;
          this.mensaje = err.error.message;  
      }
    )
    
  }
  //Fotos

  registrar(){
    this.confirmacion=false;
    this.error=false;

    this.usuario = JSON.parse(localStorage.usuario);
    this.coment.Usuario = this.usuario.Usuario;

    this.comentariosService.agregarComentario(this.coment).subscribe(
      res => {
        this.ngOnInit(); 
        this.mensaje = "agregado";
        this.confirmacion=true;
      },
      err => {
        this.error=true;
        this.mensaje = err.error.message;
      }
    ) 
  }

  verificarForm():boolean{   
    this.confirmacion=false;
    this.error=false;

    this.errorComentario=this.verificarComentario(this.coment.Comentario);
    this.errorTitulo=this.verificarTitulo(this.coment.Titulo);
    
    if((this.errorComentario+this.errorTitulo)>0){
      this.error=true;      
      return false;
    }
    return true;
  }

  verificarComentario(Comentario:string):number {
    /*if(Comentario.length==0)
      return 1;
    else if(Comentario.replace(' ','') === "")
    {
      this.coment.Comentario = "";
      return 2;
    } else if(/[$%&|<"/#]/.test(Comentario)){
      return 3;
    } else
    return 0;*/
    if(Comentario.length>200){
      this.mensaje = this.mensaje + "Comentario: Debes completar el campo, no puede superar 200 caracteres. ";
      return 1;
    }
    else
    return 0;
  }
  
  verificarTitulo(Titulo:any): number {
    /*if(Titulo.length==0)
      return 1;
    else if(Titulo.replace(' ','') === "")
    { 
      this.coment.Titulo = "";
      return 2;
    } else if(/[$%&|<>"/#]/.test(Titulo)){
      return 3;
    } else
    return 0;*/
    if(Titulo.length>100){
      this.mensaje = this.mensaje + "Titulo: Debes completar el campo, no puede superar 100 caracteres. ";
      return 1;
    }
    else
    return 0;
  } 
  
  recargarForm(){    
    this.coment.Usuario="";
    this.coment.Comentario="";
    this.coment.Titulo="";
	  this.mensaje="";
  }

}
