

export class Usuario {
    id: number;         // id, del 1 al 5 para los 5 personajes
    nombre: string;     // email segun la consigna...
    clave: string;      // contraseña
    perfil: string;     // puede ser: admin || usuario || tester || invitado
    sexo: string;       // puede ser Female || Male
  
    constructor(){
      
    }
  
    dameJSON() {
      return JSON.parse( JSON.stringify(this));
    }
}
