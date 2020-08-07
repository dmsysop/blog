import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configServer: ConfigService) => ({
        secret: configServer.get('JWT_SECRET'),
        signOptions: { expiresIn: '100s' },
      }),
    }),
  ],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
