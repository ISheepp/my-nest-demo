# Nest.js 实战

[video link](https://www.bilibili.com/video/BV1T44y1W7Si)

[official doc](https://docs.nestjs.com/)

## nest-cli

使用nest命令行生成文件 `nest g --help`

| Shell | 作用 |
| --- | --- |
| nest g co[—no-spec] | 生成一个新的controller，并且更新app.module, no-spec 不生成测试类 |
| nest g s | 生成一个新的service |
| nest g mo | 生成一个新的module并更新root module |
| nest g cl coffees/dto/coffee.dto —no-spec —flat | 在目录下生成类，--no-spec不生成测试文件，—-flat不为这个类生成文件夹 |

## 组件描述

### Controllers

![Controller](https://docs.nestjs.com/assets/Controllers_1.png)

```typescript
// 不使用整个Param对象，只使用特定的
@Get('else/:id')
@ApiOperation({
  description: '根据id查找',
})
findOneElse(@Param('id') id: number) {
  console.log(typeof id);
  // return `This action returns #${id} coffee`;
  return this.coffeeService.findOne('' + id);
}
```

类似 SpringMVC 的 Controller 都是作为 HTTP 请求端点的控制器。函数名上可以添加装饰器作为 rest 请求的语义。

+ @Post()    ==> 新增
+ @Get()     ==> 查询
+ @Delete()  ==> 删除
+ @Put()     ==> 更新全部
+ @Patch()   ==> 更新部分
+ @All()     ==> 所有请求走这个函数

括号内支持通配符匹配一类路由例如：`@Get('ab*cd')`

参数同样类似SpringMVC的参数，一般用以下几个装饰器

+ @Param() url传输
+ @Body() json形式的body传输


传输的DTO可以使用 class-validator 验证发送到端点的任何数据。

`npm i --save class-validator class-transformer` 安装

在 启动类 `main.ts` 中增加管道的配置

```typescript
// main.ts
// 整合验证管道（还有很多安装全局管道的方法）
// whitelist可以避免用户将无用参数传给我们(接口返回成功，但是入参DTO里没有多余的参数)
// forbidNonWhitelisted 当传递多余的参数时，接口直接返回400 properties should not exist
// ValidationPipe可以将我们的对象转为实例,
// 也能将网络中传输过来的字符串（url默认传字符串）转为基本类型（比如number）类型
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      // 自动将uri中传递过来的入参转成定义的type
      enableImplicitConversion: true,
    },
  }),
);
```

### Providers

![Provider](https://docs.nestjs.com/assets/Components_1.png)

广义的 Providers 可以包括很多，比如Service，Repository，Helper，Factory，主要是作为依赖注入到被使用的地方，类似Spring的概念。

使用装饰器 @Injectable() 标识一个类为Provider，可以被Nest IOC 容器托管。

在 Controller 中可以使用构造器注入所需要的 Provider 

```typescript
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}
```

也可以使用 Inject() 基于属性注入，不过还是推荐构造器注入（防止new实例依赖为空）

当我们定义好Provider且有一个消费者（Controller）使用这个Provider，我们要将这个Provider注册到 IOC 容器中

编辑 module 文件，显式声明当前模块的 providers

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

### Modules

[Module](https://docs.nestjs.com/assets/Modules_1.png)

Nest 使用 Module 来组织业务代码，防止耦合，，每个项目中有个 root 模块，root 模块用来组织所有子模块的依赖关系。使用 @Module() 装饰器标识一个模块，有如下的属性

| 属性 | 作用 |
| ------ | ------ |
| `providers` | 在此模块中要被注入的provider，将会被实例话=化 | 
| `controllers` | 这个模块中定义的控制器集合，必须被实例化 |
| `imports` | 这个模块中需要的provider（不用实例化，可能是别的模块中export出来的） |
| `exports` | 只能填写`providers`模块的子集，当填写的provider需要在别的模块被使用的时候。可以视为公共接口或者api |

The module encapsulates providers by default. This means that it's impossible to inject providers that are neither directly part of the current module nor exported from the imported modules. Thus, you may consider the exported providers from a module as the module's public interface, or API.

反正就是imports里面不能填没有exports的provider

每个功能最好分离出一个模块，然后在 root 模块进行整合。

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

// app.module.ts
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

为了防止[循环依赖](https://docs.nestjs.com/fundamentals/circular-dependency)，module 不能被注入 provider 中

module 中可以注入 provider（有些配置需要）

#### dynamic module

[link]([https://](https://docs.nestjs.com/fundamentals/dynamic-modules))



### Middleware

类似 Spring 的 AOP，暂时还没深究。

> todo

## ORM

使用 `TypeORM` 做 CRUD 操作