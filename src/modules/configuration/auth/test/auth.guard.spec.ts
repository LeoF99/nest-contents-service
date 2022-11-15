import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import AuthGuard from '../auth.guard';

jest.mock('@golevelup/nestjs-rabbitmq', () => ({
  isRabbitContext: jest.fn().mockResolvedValue(true),
}));

describe('AuthGuard', () => {
  let guard: AuthGuard;

  it('returns true/authorized for rabbitMQ request context', () => {
    const rabbitContext = 'RABBIT_HANDLER';
    guard = new AuthGuard(null);
    const response = guard.canActivate(rabbitContext as any);
    expect(isRabbitContext).toBeCalledWith(rabbitContext);
    expect(response).toBeTruthy();
  });
});
