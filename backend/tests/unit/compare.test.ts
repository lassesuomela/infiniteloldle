const GetPartialSimilarites =
  require("../../helpers/compare").GetPartialSimilarites;

describe("Compare function", () => {
  it("Should be same", () => {
    expect(GetPartialSimilarites("this,that", "this,that")).toBe(true);
  });

  it("Should be same", () => {
    expect(GetPartialSimilarites("this", "this")).toBe(true);
  });

  it("Should not be same", () => {
    expect(GetPartialSimilarites("xxx", "this,that")).toBe(false);
  });

  it("Should not be same", () => {
    expect(GetPartialSimilarites("this,that", "xxx")).toBe(false);
  });

  it("Should not be same", () => {
    expect(GetPartialSimilarites("this,that", "xxx,yyy")).toBe(false);
  });

  it("Should be partial", () => {
    expect(GetPartialSimilarites("this", "this,that")).toBe("partial");
  });

  it("Should be partial", () => {
    expect(GetPartialSimilarites("this", "that,this")).toBe("partial");
  });

  it("Should be partial", () => {
    expect(GetPartialSimilarites("this,that", "this")).toBe("partial");
  });

  it("Should be partial", () => {
    expect(GetPartialSimilarites("Ixtal", "Ixtal,Shurima")).toBe("partial");
  });

  it("Should be partial", () => {
    expect(GetPartialSimilarites("Shurima", "Ixtal,Shurima")).toBe("partial");
  });

  it("Should be partial", () => {
    expect(GetPartialSimilarites("Shurima,xxx", "Ixtal,Shurima")).toBe(
      "partial"
    );
  });

  it("Should be partial", () => {
    expect(GetPartialSimilarites("Ixtal,xxx", "Ixtal,Shurima")).toBe("partial");
  });
});
