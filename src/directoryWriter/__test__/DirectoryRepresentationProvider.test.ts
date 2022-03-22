import DirectoryRepresentationProvider from "../DirectoryRepresentationProvider";

describe("directoryWriter > DirectoryRepresentationProvider", () => {
  test("When charset is set to 'ascii' should return ascii charset", () => {
    const charset = "ascii";
    const directoryRepresentation = DirectoryRepresentationProvider.getDirectoryRepresentation(charset);
    expect(directoryRepresentation.charset.expand).toBe("+");
  });

  test("When charset is set to 'utf8' should return utf8 charset", () => {
    const charset = "utf8";
    const directoryRepresentation = DirectoryRepresentationProvider.getDirectoryRepresentation(charset);
    expect(directoryRepresentation.charset.expand).toBe("├");
    const fakeFileName = "fake.txt";
    expect(directoryRepresentation.charset.getFileRepresentation(fakeFileName)).toBe(fakeFileName);
  });

  test("When charset is set to 'utf8-icons' should return utf8 charset", () => {
    const charset = "utf8-icons";
    const directoryRepresentation = DirectoryRepresentationProvider.getDirectoryRepresentation(charset);
    expect(directoryRepresentation.charset.expand).toBe("├");
    const fakeFileName = "fake.txt";
    expect(directoryRepresentation.charset.getFileRepresentation(fakeFileName)).toBe(`📄 ${fakeFileName}`);
    expect(directoryRepresentation.charset.getFolderRepresentation(fakeFileName)).toBe(`📁 ${fakeFileName}/`);
  });

  test("Default charset should be utf8", () => {
    const directoryRepresentation = DirectoryRepresentationProvider.getDirectoryRepresentation();
    expect(directoryRepresentation.charset.expand).toBe("├");
  });

  test("Non-existing charset should be utf8", () => {
    const directoryRepresentation = DirectoryRepresentationProvider.getDirectoryRepresentation("non-existing");
    expect(directoryRepresentation.charset.expand).toBe("├");
  });
});
