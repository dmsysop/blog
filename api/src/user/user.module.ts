import { Module, forwardRef } from '@nestjs/common'
import { UserController } from './controller/user.controller'
import { UserService } from './service/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './models/user.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
