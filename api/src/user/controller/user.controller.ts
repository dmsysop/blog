import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common'
import { User } from './../models/user.interface'
import { UserService } from './../service/user.service'
import { Observable, of } from 'rxjs'
import { switchMap, map, catchError, switchMapTo } from 'rxjs/operators'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
}
