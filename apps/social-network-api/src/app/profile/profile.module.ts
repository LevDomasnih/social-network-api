import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';

@Module({
    imports: [],
    exports: [ProfileService],
    providers: [ProfileService, ProfileResolver],
})
export class ProfileModule {
}
