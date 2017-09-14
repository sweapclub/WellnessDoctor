export class PatientInterface {
  constructor(
    public PatientGUID: String,
    public HN: String,
    public FullName: String,
    public Age: String,
    public DOE: String,
    public Sex: String,
    public statusFlg: boolean
  ) { }
}
