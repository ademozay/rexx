import { container } from 'tsyringe';
import { BaseContext, makeBaseContext } from './context';
import { InjectionToken } from './injectionToken';

export class CompositionRoot {
  static register(): void {
    container.registerInstance<BaseContext>(InjectionToken.BaseContext, makeBaseContext());

    this.verify();
  }

  private static verify(): void {
    Object.keys(InjectionToken).forEach((token) => {
      if (!container.isRegistered(token)) {
        throw new Error(`💥 ${token} is not registered composition root`);
      }
    });
  }
}
