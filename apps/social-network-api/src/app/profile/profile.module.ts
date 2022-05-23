import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    controllers: [ProfileController],
    imports: [],
    exports: [ProfileService],
    providers: [ProfileService],
})
export class ProfileModule {
}
