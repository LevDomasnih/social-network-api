import { PartialType } from '@nestjs/swagger';
import { FollowModel } from '../follow.model';

export class FollowResponseDto extends PartialType(FollowModel) {}