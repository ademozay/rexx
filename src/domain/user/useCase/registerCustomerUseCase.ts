export class RegisterCustomerUseCase {
  constructor(readonly email: string, readonly password: string, readonly age: number) {}
}
