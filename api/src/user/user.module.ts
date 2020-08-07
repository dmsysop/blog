import { UserEntity } from './models/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './controller/user.controller'
import { UserService } from './service/user.service'
import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
