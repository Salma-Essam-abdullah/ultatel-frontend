
export class session {
  constructor(
    public isAuthenticated: boolean,
    public Name: string,
    public Email: string,
    public isAdmin: string,
    public UserId: string
  ) {}
}