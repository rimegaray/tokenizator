import { ExecutionContext } from '@nestjs/common';
import { CustomHeadersInterceptor } from './custom-headers.interceptor';

describe('CustomHeadersInterceptor', () => {
  const interceptor: CustomHeadersInterceptor = new CustomHeadersInterceptor();

  const callHandler = {
    handle: jest.fn(),
  };

  function createExecutionContext(request: any): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;
  }

  it('should throw BadRequestException when token header is missing', () => {
    const context = createExecutionContext({ headers: {} });
    expect(() => interceptor.intercept(context, null)).toThrowError(
      'token header is required',
    );
  });

  it('should throw BadRequestException when token header not start with pk_', () => {
    const context = createExecutionContext({
      headers: { token: 'token123' },
    });
    expect(() => interceptor.intercept(context, null)).toThrowError(
      'token header must start with pk_',
    );
  });

  it('should not throw an error when token header is present and valid', () => {
    const context = createExecutionContext({
      headers: { token: 'pk_token_test' },
    });
    callHandler.handle.mockResolvedValueOnce('next handle');

    expect(() =>
      interceptor.intercept(context, callHandler),
    ).not.toThrowError();
  });
});
