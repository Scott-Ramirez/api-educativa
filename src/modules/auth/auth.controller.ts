import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from './roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register-parent')
  @Public()
  async registerParent(@Body() body: { name: string; email: string; password: string; inviteCode: string }) {
    return this.authService.registerParent(body);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('logout')
  async logout(@Body() body: { refresh_token?: string }, @Req() req: any) {
    return this.authService.logout(body.refresh_token ?? req.headers['authorization']?.split(' ')[1]);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: any) {
    return this.authService.getCurrentUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles('PARENT')
  @Post('link-child')
  async linkChild(@Body() body: { inviteCode: string }, @Req() req: any) {
    return this.authService.linkChildToParent(body.inviteCode, req.user.id);
  }
}
