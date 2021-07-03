import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../../../services/proveedores.service';
import { UsuariosService } from '../../../services/usuarios.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-proveedores-abm',
  templateUrl: './proveedores-abm.component.html',
  styleUrls: ['./proveedores-abm.component.css']
})
export class ProveedoresAbmComponent implements OnInit {

  proveedor= {  TipoDocumento:"", NumeroDocumento:"", RazonSocial:"", Email:"", Direccion:"", Localidad:"", Provincia:"", CodigoPostal:"", Descripcion:"" };
  precio = 1;
  proveedores:any = [];

  errorTipoDocumento=0;
  errorNumeroDocumento=0;
  errorRazonSocial=0;
  errorDireccion=0;
  errorLocalidad=0;
  errorEmail=0;
  errorProvincia=0;
  errorCodigoPostal=0;
  errorDescripcion=0;

  confirmacion:boolean = false;
  error:boolean = false;
  mensaje = "";

  constructor(private proveedoresService:ProveedoresService, private router:Router, private usuariosService:UsuariosService) { }

  ngOnInit(): void {
    this.usuariosService.logued$.emit();
    this.confirmacion=false;
    this.error=false;
    this.proveedoresService.listarProveedor().subscribe(
      res => {
        this.proveedores = res;        
      },
			err => console.log(err)
		)
    
  }

  registrar(){		
    this.confirmacion=false; 
    this.error=false;
    this.proveedoresService.agregarProveedor(this.proveedor).subscribe(
      res => {
        this.ngOnInit(); 
        this.mensaje = "agregado";
        this.confirmacion=true;        
        this.recargarForm();
      },
      err => {
        this.error=true;
        this.mensaje = err.error.message;
      }
    )
  }

  editar(proveedor:any){
    this.confirmacion=false; 
    this.error=false;
    this.proveedor = proveedor;

    if(!this.verificarForm())
    {
      this.proveedoresService.listarProveedor().subscribe(
        res => {
          this.ngOnInit();
          this.error=true;      
        },
        err => console.log(err))
      
    } else
    {
      this.proveedoresService.editarProveedor(proveedor).subscribe(
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

  eliminar(proveedor:any){
    this.confirmacion=false;
    this.error=false;
    this.proveedoresService.eliminarProveedor(proveedor.Id).subscribe(
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
  
  verificarForm():boolean{    
    this.errorTipoDocumento=this.verificarTipoDocumento(this.proveedor.TipoDocumento);
    this.errorNumeroDocumento=this.verificarNumeroDocumento(this.proveedor.NumeroDocumento);
    this.errorRazonSocial=this.verificarRazonSocial(this.proveedor.RazonSocial);
    this.errorDireccion=this.verificarDireccion(this.proveedor.Direccion);
    this.errorLocalidad=this.verificarLocalidad(this.proveedor.Localidad);
    this.errorEmail=this.verificarEmail(this.proveedor.Email);
    this.errorProvincia=this.verificarProvincia(this.proveedor.Provincia);
    this.errorCodigoPostal=this.verificarCodigoPostal(this.proveedor.CodigoPostal);
    this.errorDescripcion=this.verificarDescripcion(this.proveedor.Descripcion);
    
    if((this.errorTipoDocumento+this.errorNumeroDocumento+this.errorRazonSocial+this.errorDireccion+this.errorLocalidad+this.errorEmail+this.errorProvincia+this.errorCodigoPostal+this.errorDescripcion)>0)
    {
      //this.error=true;      
      return false;
    }
    return true;
  }

  verificarTipoDocumento(TipoDocumento:string):number {
    if(TipoDocumento.length == 0){
      this.mensaje = "Tipo Documento: Debe completar el campo. ";
      return 1;
    }
    else if(TipoDocumento!="DNI" && TipoDocumento!="CUIL" && TipoDocumento!="CUIT" && TipoDocumento!="Otro"){
      this.mensaje = "Tipo Documento: Debe seleccionar los valores listados. ";
      return 2;
    }
    return 0;
  }

  onBlurTipoDocumento(TipoDocumento: any){    
    this.errorTipoDocumento=this.verificarTipoDocumento(TipoDocumento);    
  }
  
  verificarNumeroDocumento(NumeroDocumento:any): number {
    const patron=/^[0-9]{3,20}$/;
    if(NumeroDocumento<1 || (NumeroDocumento.length<3 && NumeroDocumento.length>20)){
      this.mensaje = this.mensaje + "\n Número Documento: Debe completar el campo y tener entre 3 y 20 caracteres. ";
      return 1;
    }
    else if(!patron.test(NumeroDocumento)){
      this.mensaje = this.mensaje + "\nNúmero Documento: Debe ser numérico. ";
      return 2;
    }
    else
    return 0;
  } 

  onBlurNumeroDocumento(NumeroDocumento: any){    
    this.errorNumeroDocumento=this.verificarNumeroDocumento(NumeroDocumento);    
  }

  verificarRazonSocial(RazonSocial:any): number {
    const patron=/(^[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})(\s[A-ZÁÉÍÓÚ]{1,}([a-zñáéíóú]+){0,})*$/;
    if(RazonSocial.length==0 || (RazonSocial.length<3 && RazonSocial.length>150)){
      this.mensaje = "Razón Social: Debe completar el campo y tener entre 3 y 150 caracteres. ";
      return 1;    
    }
    else if(!patron.test(RazonSocial)){
      this.mensaje = "Razón Social: Debe ser alfabético y Nombre Propio. ";
      return 2;
    }
    else
      return 0;
  }

  onBlurRazonSocial(RazonSocial: any){    
    this.errorRazonSocial=this.verificarRazonSocial(RazonSocial);    
  }

  verificarEmail(Email:any): number {
    const patron=/^[a-z0-9\_\_.]{1,30}@[a-z0-9]{1,10}(\.[a-z]{2,3}){1,3}$/;
    if(Email.length==0 || Email.length>150){
      this.mensaje = this.mensaje + "Email: Debe completar el campo y tener hasta 150 caracteres. ";
      return 1;
    }
    if(!patron.test(Email)){
      this.mensaje = this.mensaje + "Email: Debe tener formato de Email a@a.com ";
      return 2;
    }
    return 0;
  }

  onBlurEmail(Email: any){    
    this.errorEmail=this.verificarEmail(Email);    
  }

  verificarDireccion(Direccion:any): number {
    const patron=/^[^\s][A-ZÁÉÍÓÚa-zñáéíóú0-9\s]{5,}$/;
    if(Direccion.length==0 || (Direccion.length<3 && Direccion.length>100)){
      this.mensaje = this.mensaje + "Dirección: Debe completar el campo y tener entre 3 y 100 caracteres. ";
      return 1;    
    }
    else if(!patron.test(Direccion)){
      this.mensaje = this.mensaje + "Dirección: Debe ser alfanumérico. ";
      return 2;
    }
    else
      return 0;
  }

  onBlurDireccion(Direccion: any){    
    this.errorDireccion=this.verificarDireccion(Direccion);    
  }

  verificarLocalidad(Localidad:any): number {
    const patron=/^[^\s][A-ZÁÉÍÓÚa-zñáéíóú0-9\s]{3,}$/;
    if(Localidad.length==0 || (Localidad.length<3 && Localidad.length>100)){
      this.mensaje = this.mensaje + "Localidad: Debe completar el campo y tener entre 3 y 100 caracteres. ";
      return 1;    
    }
    else if(!patron.test(Localidad)){
      this.mensaje = this.mensaje + "Localidad: Debe ser alfanumérico. ";
      return 2;
    }
    else
      return 0;
  }

  onBlurLocalidad(Localidad: any){    
    this.errorLocalidad=this.verificarLocalidad(Localidad);    
  }

  verificarProvincia(Provincia:any): number {
    const patron=/^[^\s][A-ZÁÉÍÓÚa-zñáéíóú\s]{3,}$/;
    if(Provincia.length==0 || (Provincia.length<3 && Provincia.length>100)){
      this.mensaje = this.mensaje + "Provincia: Debes seleccionar una Provincia. ";
      return 1;    
    }
    else if(!patron.test(Provincia)){
      this.mensaje = this.mensaje + "Provincia: Debe ser alfabética. ";
      return 2;
    }
    else
      return 0;
  }

  onBlurProvincia(Provincia: any){    
    this.errorProvincia=this.verificarProvincia(Provincia);    
  }

  verificarCodigoPostal(CodigoPostal:any): number {
    const patron=/^[0-9]{1,5}$/;
    if(CodigoPostal<1 || CodigoPostal > 50000){
      this.mensaje = this.mensaje + "Codigo Postal: Debes completar el campo, debe estar entre 1 y 50000. ";
      return 1;
    }      
    else if(!patron.test(CodigoPostal)){
      this.mensaje = this.mensaje + "Codigo Postal: Debe ser numérico. ";
      return 2;
    }
    else
    return 0;
  }

  onBlurCodigoPostal(CodigoPostal: any){    
    this.errorCodigoPostal=this.verificarCodigoPostal(CodigoPostal);    
  }

  verificarDescripcion(Descripcion:any): number {
    if(Descripcion.length>200){
      this.mensaje = this.mensaje + "Descripcion: Debes completar el campo, no puede superar 200 caracteres. ";
      return 1;
    }
    else
    return 0;
  }

  onBlurDescripcion(Descripcion: any){    
    this.errorDescripcion=this.verificarDescripcion(Descripcion);    
  }

  recargarForm(){    
    this.proveedor.CodigoPostal="";
    this.proveedor.Descripcion="";
    this.proveedor.Direccion="";
    this.proveedor.Email="";
    this.proveedor.Localidad="";
    this.proveedor.NumeroDocumento="";
    this.proveedor.Provincia="";
    this.proveedor.RazonSocial="";
    this.proveedor.TipoDocumento="";	  
  }

}
