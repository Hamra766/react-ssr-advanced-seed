import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';
import { authenticate } from 'passport';
import { PassportModule } from '@nestjs/passport'; 
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './github.strategy';
import { ProfileService } from '../profile/shared/profile.service';
import { ProfileModel } from '../profile/shared/profile.model';

@Module({
	imports: [
		TypeOrmModule.forFeature([ProfileModel]),
		PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({
		secret: 'secretKey',
		signOptions: { expiresIn: '60s' },
	})],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, GithubStrategy, ProfileService]
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		ExpressSessionMiddleware.configure({
			secret: 'test',
			saveUninitialized: true,
    		resave: true
		});
		consumer
			.apply(ExpressSessionMiddleware, authenticate('github'))
			.forRoutes('auth/github');
	}
}
