import { PartialType } from '@nestjs/swagger';
import { UserModel } from '../../users/user.model';

export class AuthRegisterResponseDto extends PartialType(UserModel) { }