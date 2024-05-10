import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enum/rol.enum";


@Injectable()
export class RolesGuard implements CanActivate {

  // With Reflector we can access to metadatas of the decorators at run time.
  constructor(private reflector: Reflector) { }

  // canActivate is a required method for the guards.
  // context: this parameter contains information about the context of the current request
  canActivate(context: ExecutionContext): boolean {
    // ROLES_KEY: It takes the key  and an array of objects 
    // (in this case, the controller method and the controller class). 
    // roles: Stores the roles obtained from the decorators applied to the controller class and method
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      // This method provides a reference to the controller method being executed in the current request.
      context.getHandler(),
      // This method provides a reference to the controller class that is being invoked.
      context.getClass()
    ])
    // If the controller method dont have a decorator ROLES, any user can access
    if (!roles) {
      return true;
    }

    console.log(roles);
    // Comprobar si hay un rol, para que no de error y se pare el programa
    // We obtain the context of the request.
    const request = context.switchToHttp().getRequest();
    // We obatin the header of the request
    const userRoles = request.headers?.role.split(',')
    return this.validateRoles(roles, userRoles)

  }
  // Validate the roles
  validateRoles(roles: string[], userRoles: string[]) {
    // Returns true if there is any user with the role indicated in the decorator
    return roles.some(role => userRoles.includes(role))
  }
}