import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CustomHeadersInterceptor } from 'src/interceptors/custom-headers.interceptor';
import { CardService } from '../services/card-service';
import { TokenData } from '../services/dto/token-data';
import { TokenService } from '../services/token-service';
import { GenerateTokenRequestDto } from './dto/generateTokenRequestDto';
import { TokenResponseDto } from './dto/tokenResponseDto';

@Controller()
@UseInterceptors(CustomHeadersInterceptor)
export class TokenizationController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly cardService: CardService,
  ) {}

  @Post()
  async generateToken(
    @Body() generateTokenRequestDto: GenerateTokenRequestDto,
  ): Promise<TokenResponseDto> {
    const generatedToken = await this.tokenService.generateToken({
      email: generateTokenRequestDto.email,
      cardNumber: generateTokenRequestDto.card_number,
      cvv: generateTokenRequestDto.cvv,
      expirationYear: generateTokenRequestDto.expiration_year,
      expirationMonth: generateTokenRequestDto.expiration_month,
    });

    return {
      token: generatedToken,
    };
  }

  @Get('card')
  getCardByToken(@Query('token') token: string): Promise<TokenData> {
    return this.cardService.getCardByToken(token);
  }
}
