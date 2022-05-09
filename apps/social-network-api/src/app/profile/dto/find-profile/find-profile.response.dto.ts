import { ProfileEntity } from '@app/nest-postgre';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class FindProfileResponseDto extends OmitType(ProfileEntity, ['avatar', 'mainImage'] as const) {
    @ApiProperty()
    avatar: string

    @ApiProperty()
    mainImage: string
}
