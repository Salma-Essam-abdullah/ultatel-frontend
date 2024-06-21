export class StudentLogs {
  constructor(
    public operation: string,
    public operationTime: string,
    public studentId: number,
    public appUserId: string,
    public userName: string
  ) {}
}
