export class StudentLogs {
  constructor(
    public studentId: string,
    public updateAdminId: string,
    public createAdminId: number,
    public updateTimeStamps: string | null,
    public createTimeStamps: string,
    public updateUserName: string | null,
    public createUserName: string
  ) {}
}

