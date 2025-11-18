/* eslint-disable prettier/prettier */

import { IsNumber, IsString } from "class-validator";

export class CreateTopicDto{
    @IsString()
    name: string;
    
    @IsNumber()
    partitions?: number;
}

export class DeleteTopicDto{
    @IsString()
    name: string;
}

export class SendMessageDto {

    @IsString()
    topic: string;

    @IsString()
    message: string;
}

export class ConsumeTopicDto {
    @IsString()
    topic: string;
}     