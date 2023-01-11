import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('咖啡控制器')
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}
  /**
   * 返回所有的咖啡 get 请求返回的状态码为默认200
   * query 参数 使用 @Query 注解 example:
   * http://localhost:3000/coffees?limit=10&offset=10
   * @returns 返回所有的咖啡
   */
  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;
    // return `This action returns all coffees!!! Limit: ${limit}, Offset: ${offset}`;
    return this.coffeeService.findAll();
  }

  /**
   * 动态参数路由
   * @returns 返回特定id的咖啡
   */
  @Get(':id')
  findOne(@Param() params) {
    // return `This action returns #${params.id} coffee`;
    return this.coffeeService.findOne(params.id);
  }

  // 不使用整个Param对象，只使用特定的
  @Get('else/:id')
  @ApiOperation({
    description: '根据id查找',
  })
  findOneElse(@Param('id') id: string) {
    // return `This action returns #${id} coffee`;
    return this.coffeeService.findOne(id);
  }

  // post 请求返回的状态码默认为201
  // 当状态码是静态的时候，这个注解@HttpCode很好用
  // 动态状态码可以使用底层的实现，比如默认的express.js @Res() 注解
  @Post()
  @HttpCode(HttpStatus.OK)
  createCoffee(@Body() body) {
    // console.log(body.price);
    // return body;
    this.coffeeService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.coffeeService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.coffeeService.remove(id);
  }
}
