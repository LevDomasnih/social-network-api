import { IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { InlineStyleRanges } from '@app/nest-postgre';
import { plainToClass, Transform, Type } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class CreateBlogDtoInlineStyleRangesDto implements InlineStyleRanges {

    @Field(returns => String, { defaultValue: undefined })
    @IsNumber()
    @IsOptional()
    length: number;

    @Field(returns => String, { defaultValue: undefined })
    @IsNumber()
    @IsOptional()
    offset: number;

    @Field(returns => String, { defaultValue: undefined })
    @IsString()
    @IsOptional()
    style: string;
}

@InputType()
class CreateBlogDtoTextBlocks {
    @IsObject()
        // @Field(type => JSON)
    data: {};

    @IsNumber()
    @Field(type => Int)
    depth: number;

    @IsString({ each: true })
    @IsArray()
    @Field(type => [String])
    entityRanges: string[];

    @IsArray()
    @Type(() => CreateBlogDtoInlineStyleRangesDto)
    @ValidateNested({ each: true })
    @Field(type => [CreateBlogDtoInlineStyleRangesDto])
    inlineStyleRanges: Array<CreateBlogDtoInlineStyleRangesDto>;

    @IsString()
    @Field()
    key: string;

    @IsString()
    @Field()
    text: string;

    @IsString()
    @Field()
    type: string;
}

@InputType()
export class CreateBlogDto {
    @ValidateNested({ each: true })
    @Transform(({ value }) => JSON.parse(value).map((v: CreateBlogDtoTextBlocks) => plainToClass(CreateBlogDtoTextBlocks, v)))
    @Field(type => [CreateBlogDtoTextBlocks])
    textBlocks: CreateBlogDtoTextBlocks[];
    @Transform(({ value }) => JSON.parse(value))
    @IsObject()
        // @Field(type => JSON)
    entityMap: {};
}
