import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomPipe implements PipeTransform {
    constructor() { }

    transform(request: any) {
        return request;
    }
}