import { PartialType } from '@nestjs/swagger';
import { ProfileModel } from '../profile.model';

export class UpdateProfileResponseDto extends PartialType(ProfileModel) { }