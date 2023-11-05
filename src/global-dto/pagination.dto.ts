import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'page must be an intenger number' })
  @IsPositive({ message: 'perPage must be a positive integer number' })
  page: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'perPage must be an intenger number' })
  @IsPositive({ message: 'perPage must be a positive integer number' })
  perPage: number;
}
