import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../user/decorator';
import { JWTGuard } from '..//user/guard';
import { User } from '@prisma/client';
import { CreateProduct } from './dto';
import { ProductsService } from './products.service';
import { PaginationDto } from 'src/global-dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Products')
@UseGuards(JWTGuard)
@Controller('products')
@ApiHeader({
  name: 'Authorization',
  description: 'JWT token',
  required: true,
})
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({
    status: 409,
    description: 'if product with same userId and name already exist',
  })
  @ApiResponse({
    status: 201,
    description: 'if product is created successefully',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createProduct(@GetUser() user: User, @Body() dto: CreateProduct) {
    const createdProduct = await this.productService.createProduct(dto, user);
    return createdProduct;
  }

  @ApiOperation({ summary: 'Get list products with pagination' })
  @ApiResponse({
    status: 400,
    description:
      'page or perPage is less then or equal to 0. Both values must be greated then 0 and an intenger',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products in JSON format',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getProductsWithPagination(
    @Query()
    query: PaginationDto,
  ) {
    const lsitOfPorducts = await this.productService.getWithPagination(
      query.page - 1,
      query.perPage,
    );
    return lsitOfPorducts;
  }

  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiResponse({
    status: 404,
    description: 'if product is not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Product details',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product with given ID is not found');
    }
    return product;
  }

  @ApiOperation({ summary: 'Delete product details by ID' })
  @ApiResponse({
    status: 404,
    description: 'if product is not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Details of deleted product',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteProductById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product with given ID is not found');
    }
    if (product.userId !== user.id) {
      throw new ForbiddenException(
        'You cant delete products created by other users',
      );
    }
    await this.productService.deleteProductById(id, user.id);
    return product;
  }
}
