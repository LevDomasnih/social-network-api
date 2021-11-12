import { OmitType } from '@nestjs/swagger';
import { UserModel } from '../../users/user.model';

export class UpdateProfileResponseDto extends OmitType(UserModel, ['passwordHash'] as const) {}