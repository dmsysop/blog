import { User } from './../models/user.interface'
import { UserEntity } from './../models/user.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Observable, from, throwError } from 'rxjs'
import { switchMap, map, catchError, switchMapTo } from 'rxjs/operators'
import { AuthService } from 'src/auth/services/auth.service'
import { strict } from 'assert'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  getAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function(v) {
          delete v.password
        })
        return users
      }),
    )
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        if (user) {
          const { password, ...result } = user
          return result
        } else {
          throw Error
        }
      }),
    )
  }

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity()
        newUser.name = user.name
        newUser.username = user.username
        newUser.email = user.email
        newUser.password = passwordHash
        newUser.role = user.role

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user
            return result
          }),
          catchError(err => throwError(err)),
        )
      }),
    )
  }

  update(id: number, user: User): Observable<any> {
    // delete user.username
    delete user.email
    delete user.password
    return from(this.userRepository.update(id, user))
  }

  updateRoleOfUser(id: number, user: User): Observable<any> {
    return from(this.userRepository.update(id, user))
  }

  delete(id: number): Observable<any> {
    return from(this.userRepository.delete(id))
  }

  login(user: User): Observable<string> {
    return this.validadeUser(user.email.toLowerCase(), user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt))
        } else {
          return 'Crendentials Error'
        }
      }),
    )
  }

  validadeUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user
              return result
            } else {
              throw Error
            }
          }),
        ),
      ),
    )
  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email }))
  }
}
