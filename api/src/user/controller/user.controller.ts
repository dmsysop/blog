import { RolesGuard } from './../../auth/guards/roles.guard'
import { JwtAuthGuard } from './../../auth/guards/jwt-guard'
import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards } from '@nestjs/common'
import { User, UserRole } from './../models/user.interface'
import { UserService } from './../service/user.service'
import { Observable, of } from 'rxjs'
import { switchMap, map, catchError, switchMapTo } from 'rxjs/operators'
import { hasRoles } from 'src/auth/decorator/decorator.roles'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(): Observable<User[]> {
    return this.userService.getAll()
  }

  @Post()
  create(@Body() user: User): Observable<User> | Object {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message })),
    )
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt }
      }),
    )
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.update(Number(id), user)
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id)
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<User> {
    return this.userService.delete(Number(id))
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user)
  }
}
